import {createApi, fakeBaseQuery} from "@reduxjs/toolkit/query/react";
import {collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, writeBatch} from "firebase/firestore";
import {db} from "@/config/firebase";
import {BoardType} from "types/BoardType.ts";
import {ColumnType} from "types/ColumnType.ts";
import {TaskType} from "types/TaskType.ts";
import {TasksListType} from "types/TasksListType.ts";


let activeQueryFnCountColumns = 0;
let activeQueryFnCountTasks = 0;
export const boardApi = createApi({
    reducerPath: "boardApi",
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({
        getBoard: builder.query<BoardType, { userId: string | undefined; boardId: string | undefined }>({
            async queryFn({userId, boardId}) {
                const boardRef = doc(db, `users/${userId}/boards/${boardId}`);
                const boardSnap = await getDoc(boardRef)
                if (!boardSnap.exists()) {
                    throw new Error();
                }

                return {
                    data: {
                        ...boardSnap.data(),

                    } as BoardType
                };
            },
            async onCacheEntryAdded({userId, boardId}, {updateCachedData, cacheDataLoaded, cacheEntryRemoved}) {


                const boardRef = doc(db, `users/${userId}/boards/${boardId}`);
                await cacheDataLoaded;

                const unsubscribe = onSnapshot(boardRef, (snapshot) => {

                    if (!snapshot.exists()) {
                        if (boardId && window.location.href.includes(boardId)) {
                            window.location.reload();
                        }

                    }
                    const updatedData = snapshot.data();
                    updateCachedData((draft) => {
                        Object.assign(draft, updatedData)
                    });
                });


                await cacheEntryRemoved;

                unsubscribe?.();
            },


        }),
        getColumns: builder.query<ColumnType[], { userId: string | undefined; boardId: string | undefined }>({
            async queryFn({userId, boardId}) {
                const columnsQuery = query(collection(db, `users/${userId}/boards/${boardId}/columns`), orderBy("order"));
                const columnDocs = await getDocs(columnsQuery);
                const columnsData = [];

                for (const columnDoc of columnDocs.docs) {
                    const columnData: ColumnType = columnDoc.data() as ColumnType;

                    columnsData.push(columnData);
                }

                return {data: columnsData};
            },
            async onCacheEntryAdded(
                {userId, boardId},
                {updateCachedData, cacheDataLoaded, cacheEntryRemoved}
            ) {
                let unsubscribe;
                try {
                    await cacheDataLoaded;
                    const columnsQuery = query(collection(db, `users/${userId}/boards/${boardId}/columns`), orderBy("order"));

                    unsubscribe = onSnapshot(columnsQuery, async (columnSnapshot) => {
                        if (activeQueryFnCountColumns === 0) {
                            updateCachedData(() => {
                                return columnSnapshot.docs?.map((doc) => ({
                                    id: doc.data().id,
                                    title: doc.data().title,
                                    order: doc.data().order,
                                    hasTasks: doc.data().hasTasks,
                                    ...doc.data(),
                                }));
                            });
                        }
                    });

                } catch (error) {
                    throw new Error("An error occurred while fetching data.");
                }

                await cacheEntryRemoved;
                if (unsubscribe) {
                    unsubscribe();
                }
            },
        }),
        getTasksList: builder.query<TasksListType[], { userId: string | undefined; boardId: string | undefined, columns: ColumnType[] | undefined  }>({
            async queryFn({userId, boardId, columns}) {
                if (!columns) {
                    return { data: [] }; // or any appropriate response
                }
                const tasksPromises = columns

                    .map(async column => {
                        const columnId = column.id;
                        const tasksQuery = query(collection(db, `users/${userId}/boards/${boardId}/columns/${columnId}/tasks`), orderBy("order"));
                        const tasksDocs = await getDocs(tasksQuery);
                        const tasksData = tasksDocs.docs.map(taskDoc => {
                            const taskData = taskDoc.data() as TaskType;
                            return {
                                ...taskData,
                                columnId,
                            };
                        });
                        return {
                            id: columnId,
                            tasks: tasksData,
                        };
                    });

                const tasksList = await Promise.all(tasksPromises);


                return {data: tasksList};
            },
            async onCacheEntryAdded(
                {userId, boardId, columns},
                {updateCachedData, cacheDataLoaded, cacheEntryRemoved}
            ) {
                if (!columns) {
                    return;
                }
                await cacheDataLoaded;
                const unsubscribes: (() => void)[] = [];

                try {
                    const tasksPromises = columns
                        .map(column => {
                            const columnId = column.id;
                            const tasksQuery = query(collection(db, `users/${userId}/boards/${boardId}/columns/${columnId}/tasks`), orderBy("order"));

                            const unsubscribe = onSnapshot(tasksQuery,  { includeMetadataChanges: true }, tasksSnapshot => {
                                if (activeQueryFnCountTasks === 0) {
                                    updateCachedData(prevData => {
                                        return prevData.map(item =>
                                            item.id === columnId
                                                ? {...item, tasks: tasksSnapshot.docs.map(doc => ({id: doc.data().id, title: doc.data().title, order: doc.data().order, ...doc.data()}))}
                                                : item
                                        );
                                    });
                                }
                            });

                            unsubscribes.push(unsubscribe);
                        });

                    await Promise.all(tasksPromises);


                } catch (error) {
                    throw new Error("An error occurred while fetching data.");
                }

                await cacheEntryRemoved;
                unsubscribes.forEach(unsubscribe => unsubscribe());
            },
        }),
        changeTitle: builder.mutation({
            async queryFn({newTitle, userId, boardId}) {
                const boardRef = doc(db, `users/${userId}/boards/${boardId}`);
                const batch = writeBatch(db);
                batch.update(boardRef, {title: newTitle});
                batch.update(boardRef, {date: Date.now()});
                try {

                    await batch.commit();
                    return {data: "updated"};
                } catch (err) {
                    throw new Error();
                }
            },
            onQueryStarted({newTitle, boardId, userId}, {
                dispatch, queryFulfilled
            }) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData('getBoard', {boardId, userId}, (draft) => {
                        draft.title = newTitle
                        draft.date = Date.now()
                    })
                );

                queryFulfilled.catch(patchResult.undo);
            },
        }),
        changeStatus: builder.mutation({
            async queryFn({newStatus, userId, boardId}) {
                const boardRef = doc(db, `users/${userId}/boards/${boardId}`);
                const batch = writeBatch(db);
                batch.update(boardRef, {status: newStatus});
                batch.update(boardRef, {date: Date.now()});
                try {

                    await batch.commit();
                    return {data: "updated"};
                } catch (err) {
                    throw new Error();
                }
            },
            onQueryStarted({newStatus, boardId, userId}, {
                dispatch, queryFulfilled
            }) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData('getBoard', {boardId, userId}, (draft) => {
                        draft.status = newStatus
                        draft.date = Date.now()
                    })
                );
                queryFulfilled.catch(patchResult.undo);
            },
        }),
        addColumn: builder.mutation({
            async queryFn({columns, newColumn, docRef, boardId, userId}) {
                try {
                    activeQueryFnCountColumns++;
                    const batch = writeBatch(db);
                    const boardRef = doc(db, `users/${userId}/boards/${boardId}`);
                    batch.set(docRef, newColumn);
                    const order = columns.length
                    batch.update(docRef, {order: order});
                    batch.update(boardRef, {date: Date.now()});
                    await batch.commit().finally(() => activeQueryFnCountColumns--);
                    return {data: "updated"};
                } catch (err) {
                    throw new Error();
                }

            },
            onQueryStarted({newColumn, userId, boardId}, {
                dispatch, queryFulfilled
            }) {
                const patchResultColumn = dispatch(
                    boardApi.util.updateQueryData('getColumns', {boardId, userId}, (draft: ColumnType[]) => {
                        draft.push(newColumn)
                    }),
                )
                const patchResultBoard = dispatch(
                    boardApi.util.updateQueryData('getBoard', {boardId, userId}, (draft) => {
                        draft.date = Date.now()
                    })
                );
                queryFulfilled.catch(() => {
                    patchResultColumn.undo;
                    patchResultBoard.undo
                });
            },

        }),
        deleteColumn: builder.mutation({
            async queryFn({columnRef}) {
                try {
                    const batch = writeBatch(db);
                    batch.delete(columnRef);

                    await batch.commit()
                    return {data: "updated"};
                } catch (err) {
                    throw new Error();
                }

            },
            onQueryStarted({deleteId, userId, boardId}, {
                dispatch, queryFulfilled
            }) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData('getColumns', {boardId, userId}, (draft) => {
                        draft.filter((column) => column.id !== deleteId)
                    })
                );
                queryFulfilled.catch(patchResult.undo);
            },

        }),
        addTask: builder.mutation({
            async queryFn({tasks, newTask, docRef, boardId, userId}) {
                try {

                    const batch = writeBatch(db);
                    const boardRef = doc(db, `users/${userId}/boards/${boardId}`);
                    batch.set(docRef, newTask);
                    const order = tasks.length
                    batch.update(docRef, {order: order});
                    batch.update(boardRef, {date: Date.now()});
                    await batch.commit();
                    return {data: "updated"};
                } catch (err) {
                    throw new Error();
                }

            },
            onQueryStarted({newTask, userId, boardId, columns, columnId}, {
                dispatch, queryFulfilled
            }) {
                const patchResultColumn = dispatch(
                    boardApi.util.updateQueryData('getTasksList', {boardId, userId, columns}, (draft: TasksListType[]) => {
                      const tasks =   draft.find(tasks => tasks.id === columnId)
                        if(tasks){
                        tasks.tasks.push(newTask)
                        }
                        else{
                            draft.push({id: columnId, tasks:[newTask]})
                        }
                    }),
                )
                const patchResultBoard = dispatch(
                    boardApi.util.updateQueryData('getBoard', {boardId, userId}, (draft) => {
                        draft.date = Date.now()
                    })
                );
                queryFulfilled.catch(() => {
                    patchResultColumn.undo;
                    patchResultBoard.undo
                });
            },

        }),
        changeTitleColumn: builder.mutation({
            async queryFn({newTitle, userId, boardId, columnId}) {
                const boardRef = doc(db, `users/${userId}/boards/${boardId}`);
                const columnRef = doc(db, `users/${userId}/boards/${boardId}/columns/${columnId}`);
                const batch = writeBatch(db);
                batch.update(columnRef, {title: newTitle});
                batch.update(boardRef, {date: Date.now()});
                try {

                    await batch.commit();
                    return {data: "updated"};
                } catch (err) {
                    console.log(err)
                    throw new Error();
                }
            },
            onQueryStarted({newTitle, boardId, userId, columnId}, {
                dispatch, queryFulfilled
            }) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData('getColumns', {boardId, userId}, (draft:ColumnType[]) => {
                        const columnToUpdate = draft.find(column => column.id === columnId);
                        if (columnToUpdate) {
                            columnToUpdate.title = newTitle;
                        }

                    })

                );
                const patchResultBoard = dispatch(
                    boardApi.util.updateQueryData('getBoard', {boardId, userId}, (draft) => {
                        draft.date = Date.now()
                    })
                );

                queryFulfilled.catch(() => {
                    patchResult.undo;
                    patchResultBoard.undo
                });
            },
        }),
        swapColumns: builder.mutation({
            async queryFn({boardId, columns, userId}) {
                try {

                    const batch = writeBatch(db);
                    const boardRef = doc(db, `users/${userId}/boards/${boardId}`);
                    const collectionRef = collection(db, `users/${userId}/boards/${boardId}/columns`);
                    columns.forEach((col: ColumnType, index: number) => {
                        const docRef = doc(collectionRef, col.id);
                        batch.update(docRef, {order: index});
                    });
                    batch.update(boardRef, {date: Date.now()});

                    await batch.commit();

                    return {data: "updated"};
                } catch (err) {
                    console.log(err)
                    throw new Error();
                }
            },
            onQueryStarted({columns,boardId, userId}, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData('getColumns', {userId,boardId}, (draft:ColumnType[]) => {
                        Object.assign(draft, columns);
                    })
                );
                const patchResultBoard = dispatch(
                    boardApi.util.updateQueryData('getBoard', {boardId, userId}, (draft) => {
                        draft.date = Date.now()
                    })
                );
                queryFulfilled.catch(() => {
                    patchResult.undo;
                    patchResultBoard.undo
                });
            },
        }),
        swapTasks: builder.mutation({
            async queryFn({boardId, tasksList, userId, activeColumnId, overColumnId, addedTask, deletedTask}) {
                try {
                    const batch = writeBatch(db);
                    const boardRef = doc(db, `users/${userId}/boards/${boardId}`);
                    if (activeColumnId == overColumnId){
                        const colRef = collection(db, `users/${userId}/boards/${boardId}/columns/${activeColumnId}/tasks`);
                        const batch = writeBatch(db);
                        const tasks = tasksList.find((column:ColumnType) => column.id === activeColumnId).tasks
                        tasks.forEach((task: TaskType, index: number) => {
                            const docRef = doc(colRef, task.id);
                            batch.update(docRef, {order: index});
                        });
                        batch.update(boardRef, {date: Date.now()});


                    }
                    else{
                        if (addedTask){
                            const collectionRef = collection(db, `users/${userId}/boards/${boardId}/columns/${overColumnId}/tasks`);
                            const tasks = tasksList.find((column:ColumnType) => column.id === overColumnId).tasks
                            const addedDocRef = doc(collectionRef, addedTask.id);
                            batch.set(addedDocRef, { ...addedTask, order: tasks.length });
                             tasks.forEach((task: TaskType, index: number) => {
                                const docRef = doc(collectionRef, task.id);
                               batch.update(docRef, {order: index});
                             });
                        }
                        if (deletedTask){
                            const collectionRef = collection(db, `users/${userId}/boards/${boardId}/columns/${activeColumnId}/tasks`);
                            const tasks = tasksList.find((column:ColumnType) => column.id === activeColumnId).tasks
                            const removedDocRef = doc(collectionRef, deletedTask.id);
                            batch.delete(removedDocRef);
                            tasks.forEach((task: TaskType, index: number) => {
                                const docRef = doc(collectionRef, task.id);
                                batch.update(docRef, {order: index});
                            });
                        }
                    }



                    batch.update(boardRef, {date: Date.now()});
                    await batch.commit();

                    return {data: "updated"};
                } catch (err) {

                    throw new Error();
                }
            },
            onQueryStarted({columns,boardId, userId, tasksList }, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    boardApi.util.updateQueryData('getTasksList', {userId,boardId, columns}, (draft:TasksListType[]) => {
                      Object.assign(draft,tasksList )

                    })
                );
                const patchResultBoard = dispatch(
                    boardApi.util.updateQueryData('getBoard', {boardId, userId}, (draft) => {
                        draft.date = Date.now()
                    })
                );
                queryFulfilled.catch(() => {
                    patchResult.undo;
                    patchResultBoard.undo
                });
            },
        }),
    }),
});

export const {
    useGetBoardQuery,
    useGetColumnsQuery,
    useGetTasksListQuery,
    useChangeTitleMutation,
    useChangeStatusMutation,
    useAddColumnMutation,
    useDeleteColumnMutation, useAddTaskMutation, useChangeTitleColumnMutation, useSwapColumnsMutation, useSwapTasksMutation
} = boardApi;
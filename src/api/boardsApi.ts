import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BoardType} from 'types/BoardType'; // Removed ".ts" extension
import {db} from "@/config/firebase";
import {collection, CollectionReference, doc, onSnapshot, orderBy, query, writeBatch} from "firebase/firestore";


export const boardsApi = createApi({
    reducerPath: "boardsApi",
    baseQuery: fetchBaseQuery({baseUrl: '/api'}),
    endpoints: (builder) => ({
        getBoards: builder.query<BoardType[], string>({
            async queryFn() {
                return {data: []};
            },
            async onCacheEntryAdded(
                userId,
                {updateCachedData, cacheDataLoaded, cacheEntryRemoved}
            ) {
                let unsubscribe;
                try {

                    await cacheDataLoaded;
                    const q = query(collection(db, `users/${userId}/boards`), orderBy("order"));
                    unsubscribe = onSnapshot(q, (snapshot) => {
                        updateCachedData(() => {
                            return snapshot?.docs?.map((doc) => ({
                                id: doc.data().id,
                                title: doc.data().title,
                                description: doc.data().description,
                                order: doc.data().order,
                                ...doc.data(),
                            }));
                        });
                    });
                } catch (error) {
                    throw new Error();
                }
                await cacheEntryRemoved;
                unsubscribe();

            },

        }),
        swapBoards: builder.mutation({
            async queryFn({data: boards, userId}) {
                try {
                    const batch = writeBatch(db);
                    const collectionRef: CollectionReference = collection(db, `users/${userId}/boards`);
                    boards.forEach((board: BoardType, index: number) => {
                        const docRef = doc(collectionRef, board.id);
                        batch.update(docRef, {order: index});
                    });
                    await batch.commit();
                    return {data: "updated"};
                } catch (err) {
                    throw new Error();
                }
            },
            onQueryStarted({data, userId}, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    boardsApi.util.updateQueryData('getBoards', userId, (draft) => {
                        Object.assign(draft, data);
                    })
                );
                queryFulfilled.catch(patchResult.undo);
            },
        }),
        addBoard: builder.mutation({
            async queryFn({boards, newBoard, docRef, collectionRef}) {
                try {


                    const batch = writeBatch(db);
                    batch.set(docRef, newBoard);

                    boards.forEach((board: BoardType) => {
                        const docRef = doc(collectionRef, board.id);
                        batch.update(docRef, {order: board.order});
                    });
                    await batch.commit();
                    return {data: "updated"};
                } catch (err) {
                    console.log(err)
                    throw new Error();
                }
            },
            onQueryStarted({newBoard, userId}, {
                dispatch, queryFulfilled
            }) {
                const patchResult = dispatch(
                    boardsApi.util.updateQueryData('getBoards', userId, (draft) => {
                        draft.unshift(newBoard)
                    })
                );
                queryFulfilled.catch(patchResult.undo);
            },

        }),
        deleteBoard: builder.mutation({
            async queryFn({boards, boardRef, boardsRef}) {
                try {

                    const batch = writeBatch(db);
                    batch.delete(boardRef);
                    // Update the order of all boards based on their new index in the batch
                    boards.forEach((board: BoardType, index: number) => {
                        const docRef = doc(boardsRef, board.id);
                        batch.update(docRef, {order: index});
                    });
                    batch.commit()
                    return {data: "updated"};
                } catch (err) {
                    console.log(err)
                    throw new Error();
                }
            },
            onQueryStarted({deleteId, userId}, {
                dispatch, queryFulfilled
            }) {
                const patchResult = dispatch(
                    boardsApi.util.updateQueryData('getBoards', userId, (draft) => {
                        draft.filter((board) => board.id !== deleteId).map((board: BoardType, index: number) => {
                            return {...board, order: index};
                        });
                    })
                );
                queryFulfilled.catch(patchResult.undo);
            },

        }),
    }),
});
// noinspection JSUnusedGlobalSymbols
export const {useGetBoardsQuery, useSwapBoardsMutation, useAddBoardMutation, useDeleteBoardMutation} = boardsApi;
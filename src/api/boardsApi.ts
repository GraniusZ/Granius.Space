import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BoardType} from 'types/BoardType';
import {db} from "@/config/firebase";
import {collection, getDocs, onSnapshot, orderBy, query, writeBatch} from "firebase/firestore";


export const boardsApi = createApi({
    reducerPath: "boardsApi",
    baseQuery: fetchBaseQuery({baseUrl: '/api'}),
    endpoints: (builder) => ({
        getBoards: builder.query<BoardType[], string>({
            async queryFn(userId) {
                const q = query(collection(db, `users/${userId}/boards`), orderBy('date', 'desc'));
                const boards = await getDocs(q)
                const mappedData: BoardType[] = await Promise.all(
                    boards.docs.map(async (doc) => {


                        const boardData = doc.data();

                        return {
                            id: boardData.id,
                            title: boardData.title,
                            date: boardData.date,
                            author: boardData.author,
                            status: boardData.status
                        }
                    }))
                return {data: mappedData};
            },
            async onCacheEntryAdded(
                userId,
                {updateCachedData, cacheDataLoaded, cacheEntryRemoved,}
            ) {
                let unsubscribe;
                try {

                    await cacheDataLoaded;
                    const q = query(collection(db, `users/${userId}/boards`), orderBy('date', 'desc'));

                    unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
                        updateCachedData(() => {
                            return snapshot.docs?.map((doc) => (
                                {
                                id: doc.data().id,
                                title: doc.data().title,
                                date: doc.data().date,
                                author: doc.data().author,
                                status: doc.data().status,
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

        addBoard: builder.mutation({
            async queryFn({newBoard, docRef}) {
                try {


                    const batch = writeBatch(db);
                    batch.set(docRef, newBoard);
                    await batch.commit();
                    return {data: "updated"};
                } catch (err) {
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
            async queryFn({boardRef}) {
                try {

                    const batch = writeBatch(db);
                    batch.delete(boardRef);

                    batch.commit()
                    return {data: "updated"};
                } catch (err) {

                    throw new Error();
                }
            },
            onQueryStarted({deleteId, userId}, {
                dispatch, queryFulfilled
            }) {
                const patchResult = dispatch(
                    boardsApi.util.updateQueryData('getBoards', userId, (draft) => {
                        draft.filter((board) => board.id !== deleteId)
                    })
                );
                queryFulfilled.catch(patchResult.undo);
            },

        }),
    }),
});
// noinspection JSUnusedGlobalSymbols
export const {useGetBoardsQuery, useAddBoardMutation, useDeleteBoardMutation} = boardsApi;
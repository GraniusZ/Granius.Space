import { useEffect } from 'react';
import { db } from "@/config/firebase";
import { BoardType } from 'types/BoardType.ts';
import { collection, onSnapshot, query, orderBy, Unsubscribe } from "firebase/firestore";
import { useAppDispatch } from "@hooks/useTypedDispatch.ts";
import { setBoards } from "@store/slices/userSlice.ts";

const useRealtimeFirestoreBoards = (userId: string, shouldTrack: boolean): void => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        let unsubscribe: Unsubscribe | undefined;
        const trackBoards = async () => {
            const q = query(collection(db, `users/${userId}/boards`), orderBy("order"));
            unsubscribe = onSnapshot(q, (snapshot) => {
                const boards: BoardType[] = [];
                snapshot.forEach((doc) => {
                    const boardData: BoardType = {
                        title: doc.data().title,
                        description: doc.data().description,
                        order:doc.data().number,
                        ...doc.data(),
                    };
                    boards.push(boardData);
                });
                dispatch(setBoards(boards));
            });
        };

        if (shouldTrack) {
            trackBoards().then();
        }
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [userId, shouldTrack, dispatch]);

};

export default useRealtimeFirestoreBoards;

import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {BoardType} from "types/BoardType.ts";
import {setCloseBoardCreate} from "@store/slices/boardMenuSlice.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {useAddBoardMutation, useGetBoardsQuery} from "@/api/boardsApi.ts";
import {collection, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {setOnline} from "@store/slices/networkSlice.ts";
import {useState} from "react";


const useCreateBoard = () => {
    const user = useAppSelector((state) => state.user.user);
    const {data} = useGetBoardsQuery(user.uid, {skip: !user.uid});
    const boards = data || [];
    const [addBoard] = useAddBoardMutation()
    const dispatch = useAppDispatch();
    const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>( null); // Добавляем состояние для таймера

    const handleAdd = async (data: BoardType) => {
        if (deleteTimer) {
            clearTimeout(deleteTimer);
        }
        if (!navigator.onLine) {
            dispatch(setOnline(false))
            const newTimer = setTimeout(() => dispatch(setOnline(true)), 3000);
            setDeleteTimer(newTimer);
            return;
        }
        const newBoardData = {
            ...data,
            order: 0,

        };
        const updatedBoards = boards.map((board: BoardType) => ({
            ...board,
            order: board.order + 1,
        }));
        const collectionRef = collection(db, `users/${user.uid}/boards`);
        const newDocRef = doc(collectionRef);
        newBoardData.id = newDocRef.id
        await Promise.all([
            addBoard({boards: updatedBoards, newBoard: newBoardData, userId: user.uid, docRef: newDocRef, collectionRef:collectionRef}),
            dispatch(setCloseBoardCreate())
        ]);
    };

    return {
        handleAdd,
    };
};

export default useCreateBoard;
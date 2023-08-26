import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {BoardType} from "types/BoardType.ts";
import {setCloseBoardCreate} from "@store/slices/boardMenuSlice.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {useAddBoardMutation} from "@/api/boardsApi.ts";
import {collection, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {setOnline} from "@store/slices/networkSlice.ts";
import {useState} from "react";


const useCreateBoard = () => {
    const user = useAppSelector((state) => state.user.user);

    const [addBoard] = useAddBoardMutation()
    const dispatch = useAppDispatch();
    const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>( null); // Добавляем состояние для таймера

    const handleAdd = async (data: BoardType) => {
        console.log(data)
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
            author: user.displayName,
            date: Date.now(),
        };
        const collectionRef = collection(db, `users/${user.uid}/boards`);
        const newDocRef = doc(collectionRef);
        newBoardData.id = newDocRef.id
        await Promise.all([
            addBoard({newBoard: newBoardData, userId: user.uid, docRef: newDocRef,}),
            dispatch(setCloseBoardCreate())
        ]);
    };

    return {
        handleAdd
    };
};

export default useCreateBoard;
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {ColumnType} from "types/ColumnType.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {useState} from "react";
import {setOnline} from "@store/slices/networkSlice.ts";
import {collection, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {useAddColumnMutation, useGetColumnsQuery} from "@/api/boardApi.ts";


export const useAddColumn = () => {
    const activeId = useAppSelector((state) => state.boardMenu.activeId);
    const user = useAppSelector((state) => state.user.user);
    const [addColumn] = useAddColumnMutation()
    const {data: columns} = useGetColumnsQuery({userId: user?.uid, boardId: activeId})

    const dispatch = useAppDispatch();
    const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);
    const handleAdd = async (data: ColumnType) => {
        if (deleteTimer) {
            clearTimeout(deleteTimer);
        }

        if (!navigator.onLine) {
            dispatch(setOnline(false))
            const newTimer = setTimeout(() => dispatch(setOnline(true)), 3000);
            setDeleteTimer(newTimer);
            return;
        }
        const newColumnData = {
            ...data,

        };

        const collectionRef = collection(db, `users/${user.uid}/boards/${activeId}/columns`);
        const newDocRef = doc(collectionRef);
        newColumnData.id = newDocRef.id
        await Promise.all([
            addColumn({
                newColumn: newColumnData,
                userId: user.uid,
                boardId: activeId,
                docRef: newDocRef,
                collectionRef: collectionRef,
                columns: columns

            }),

        ])
    };
    return {handleAdd};
};



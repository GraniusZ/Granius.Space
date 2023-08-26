import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {collection, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {useDeleteColumnMutation} from "@/api/boardApi";
import {setOnline} from "@store/slices/networkSlice.ts";
import {useState} from "react";
import {setActiveColumn, setColumnSettings} from "@store/slices/boardPageSlice.ts";

const useDeleteColumn = () => {

    const user = useAppSelector((state) => state.user.user);
    const activeBoardId = useAppSelector((state) => state.boardMenu.activeId);

    const activeColumn = useAppSelector((state) => state.boardPage.activeColumn);
    const id = activeColumn.id
    const dispatch = useAppDispatch();
    const [deleteBoard] = useDeleteColumnMutation()
    const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null); // Добавляем состояние для таймера

    const handleDelete = async () => {
        if (deleteTimer) {
            clearTimeout(deleteTimer);
        }
        if (!navigator.onLine) {
            dispatch(setOnline(false))
            const newTimer = setTimeout(() => dispatch(setOnline(true)), 3000);
            setDeleteTimer(newTimer);
            return;
        }

        const columnRef = doc(collection(db, `users/${user.uid}/boards/${activeBoardId}/columns`), id);

        await Promise.all([
            deleteBoard({userId: user.uid, columnRef: columnRef, deleteId: id, boardId: activeBoardId}),
            dispatch(setOnline(true)),
            dispatch(setColumnSettings(false)),
            dispatch(setActiveColumn({}))
        ])

    }

    return {
        handleDelete
    }

}
export default useDeleteColumn;
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {ColumnType} from "types/ColumnType.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {useState} from "react";
import {setOnline} from "@store/slices/networkSlice.ts";
import {collection, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {useAddTaskMutation} from "@/api/boardApi.ts";
import {useOutletContext} from "react-router-dom";
import {TaskType} from "types/TaskType.ts";

type ContextType = { localColumns: ColumnType[] };

export const useAddTask = () => {
    const activeId = useAppSelector((state) => state.boardMenu.activeId);
    const user = useAppSelector((state) => state.user.user);
    const [addTask] = useAddTaskMutation()
    const {localColumns: columns} = useOutletContext<ContextType>()
    const activeColumn = useAppSelector((state) => state.boardPage.activeColumn);
    const dispatch = useAppDispatch();
    const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);
    const handleAdd = async (data: TaskType, tasks: TaskType[]) => {
        if (deleteTimer) {
            clearTimeout(deleteTimer);
        }

        if (!navigator.onLine) {
            dispatch(setOnline(false))
            const newTimer = setTimeout(() => dispatch(setOnline(true)), 3000);
            setDeleteTimer(newTimer);
            return;
        }
        const newTaskData = {
            ...data,

        };
        const collectionRef = collection(db, `users/${user.uid}/boards/${activeId}/columns/${activeColumn.id}/tasks`);
        const newDocRef = doc(collectionRef);
        newTaskData.id = newDocRef.id
        await Promise.all([
            addTask({
                newTask: newTaskData,
                userId: user.uid,
                boardId: activeId,
                docRef: newDocRef,
                collectionRef: collectionRef,
                columns: columns,
                columnId: activeColumn.id,
                tasks: tasks

            }),

        ])
    };
    return {handleAdd};
};



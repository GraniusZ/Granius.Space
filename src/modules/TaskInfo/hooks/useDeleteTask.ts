import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setOnline} from "@store/slices/networkSlice.ts";
import {useState} from "react";
import {useRemoveTaskMutation} from "@/api/boardApi";
import {TaskType} from "types/TaskType";
import {ColumnType} from "types/ColumnType";
import {TasksListType} from "types/TasksListType";
import {setTaskInfo} from "@store/slices/boardPageSlice";

const useDeleteBoard = () => {
    const user = useAppSelector((state) => state.user.user);
    const dispatch = useAppDispatch();
    const [deleteTask] = useRemoveTaskMutation()
    const activeId = useAppSelector((state) => state.boardMenu.activeId);
    const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);
    const handleDelete = async (task: TaskType | undefined, columns: ColumnType[], list: TasksListType[]) => {
        const columnId = list.find(column => column.tasks.some(columnTask => task?.id === columnTask.id))?.id

        if (deleteTimer) {
            clearTimeout(deleteTimer);
        }
        if (!navigator.onLine) {
            dispatch(setOnline(false))
            const newTimer = setTimeout(() => dispatch(setOnline(true)), 3000);
            setDeleteTimer(newTimer);
            return;
        }


        await Promise.all([
            deleteTask({userId: user.uid, boardId: activeId, columns: columns, taskId: task?.id, columnId: columnId}),
            dispatch(setOnline(true)),
            dispatch(setTaskInfo(false))
        ])

    }

    return {
        handleDelete
    }

}
export default useDeleteBoard;
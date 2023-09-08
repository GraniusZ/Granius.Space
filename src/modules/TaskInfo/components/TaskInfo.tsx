import {FC, memo} from "react";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {TaskType} from "types/TaskType.ts";
import {ReactComponent as DeleteIcon} from "@assets/icons/DeleteIcon.svg";
import {setTaskInfo, setTaskInfoContent, setTitleTaskChange} from "@store/slices/boardPageSlice.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {ReactComponent as CloseIcon} from "@assets/icons/CloseIcon.svg";
import {TaskTitleChange} from "@modules/TaskInfo/components/TaskTitleChange";
import {TasksListType} from "types/TasksListType";
import {useOutletContext} from "react-router-dom";
import {ColumnType} from "types/ColumnType";
import useDeleteTask from "@modules/TaskInfo/hooks/useDeleteTask";

type ContextType = { localTasksList: TasksListType[], localColumns:ColumnType[] };
export const TaskInfo: FC = memo(() => {
    const dispatch = useAppDispatch()

    const taskId:string = useAppSelector(state => state.boardPage.taskInfoContentId)
    const {localTasksList: list, localColumns:columns} = useOutletContext<ContextType>()
    const task:TaskType | undefined = list.find(column => column.tasks.some(task => task.id == taskId))?.tasks.find(task => task.id === taskId);
    const isTitleTaskChangeOpen = useAppSelector(state => state.boardPage.titleTaskChange)
    const { handleDelete} = useDeleteTask();
    const handleClose = () => {
        dispatch(setTaskInfo(false))
        dispatch(setTaskInfoContent(false))
    }
    const handleOpenTitleChange = () => {
        dispatch(setTitleTaskChange(true))
    }
    return (
        <div
            className="top-0  bottom-0 w-screen h-screen flex justify-center items-center font-mono absolute z-50 overflow-hidden">
            <div
                className="sm:max-h-[90%] h-full w-full max-w-2xl bg-main-1 absolute z-50  sm:mx-10 sm:rounded-xl flex flex-col  px-8 pb-16">
                <div className="h-fit w-full sticky flex justify-end top-3 ">
                    <div onClick={handleClose}
                         className="w-8 h-8  noSelect flex justify-center items-center cursor-pointer "
                    >
                        <CloseIcon className="w-4 h-4  "/>
                    </div>
                </div>
                <div className="h-fit w-full flex justify-between flex-col items-center relative gap-4  overflow-y-auto">

                    {isTitleTaskChangeOpen ? <TaskTitleChange title={task?.title} task={task}/> : (<span
                        className=" w-full cursor-pointer text-main-4 break-words font-semibold pr-10 text-sm brightness-150"
                        onClick={handleOpenTitleChange}>
                  {task?.title}</span>)}


                </div>
                <div className="absolute bottom-3 right-3 cursor-pointer" onClick={() => handleDelete(task, columns, list)}>
                    <div
                        className="w-fit px-3 py-2 text-sm text-main-7 bg-main-2 rounded-xl flex flex-row gap-2 items-center active:scale-105 transition-all duration-100 ease-in-out"
                        >
                        <DeleteIcon className="w-6 h-6 "/>
                        Trash Task
                    </div>


                </div>
            </div>
            <div className={` w-screen h-screen absolute visible  bg-main-1  opacity-50 z-30 `}
                 onClick={handleClose}
            >
            </div>


        </div>
    );
});
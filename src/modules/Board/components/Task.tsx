import {FC} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {TaskType} from "types/TaskType.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setTaskInfo, setTaskInfoContent} from "@store/slices/boardPageSlice.ts";
type Task = {
    task:TaskType,
    id:string
}
export const Task: FC<Task> = ({task, id}) => {
    const dispatch = useAppDispatch()
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: id,
        data: {
            type: "Task",
            task,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.2 : 1,
        willChange: "transform",

    };
    const handleClickOpenTask = () =>{
        dispatch(setTaskInfo(true))
        dispatch(setTaskInfoContent(task.id))
    }
    return (

        <div className="rounded-sm bg-main-3 h-[60px] min-h-[60px] py-4 px-3 pr-10 z-10 ellipsis group/task  noSelect cursor-pointer border-main-7 border flex items-center justify-center"  onClick={handleClickOpenTask} ref={setNodeRef}
             {...attributes}
             {...listeners}
             style={style}>
            <div className=" h-fit w-full  text-sm   ellipsis text-main-1 font-bold !whitespace-nowrap  group-hover/task:text-main-7 group-hover/task:opacity-80 group-hover/task:brightness-150 noSelect transition-all duration-300 ease-in-out">{task?.title}</div>
        </div>
    );
};
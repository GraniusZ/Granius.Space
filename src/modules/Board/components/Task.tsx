import {FC} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {TaskType} from "types/TaskType.ts";
type Task = {
    task:TaskType,
    id:string
}
export const Task: FC<Task> = ({task, id}) => {
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
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        willChange: "transform",

    };
    return (

        <div className="rounded-sm bg-main-3 py-4 px-3 pr-10 z-10 group/task noSelect cursor-pointer border-main-7 border flex h-fit"   ref={setNodeRef}
             {...attributes}
             {...listeners}
             style={style}>
            <div className=" h-fit w-full text-sm text-main-1 font-bold break-words group-hover/task:text-main-7 group-hover/task:opacity-80 group-hover/task:brightness-150 noSelect transition-all duration-300 ease-in-out">{task?.title}</div>
        </div>
    );
};
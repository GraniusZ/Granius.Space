import {FC} from "react";
import {TaskType} from "types/TaskType.ts";
type TaskOverlay = {
    task:TaskType,

}
export const TaskOverlay: FC<TaskOverlay> = ({task}) => {
    return (
        <div className="rounded-sm bg-main-3 py-4 px-3 pr-10 z-10 shadow-xl group/task noSelect cursor-pointer border-main-7 border "
           >
            <div className=" h-fit w-full text-sm text-main-1 font-bold break-words group-hover/task:text-main-7 group-hover/task:opacity-80 group-hover/task:brightness-150 noSelect transition-all duration-300 ease-in-out">{task?.title}</div>
        </div>
    );
};
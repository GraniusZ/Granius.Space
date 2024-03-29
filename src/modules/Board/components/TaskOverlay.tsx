import {FC} from "react";
import {TaskType} from "types/TaskType.ts";

type TaskOverlay = {
    task:TaskType,

}
export const TaskOverlay: FC<TaskOverlay> = ({task}) => {
    return (
        <div
            className="rounded-sm bg-main-3 h-[60px] min-h-[60px] py-4 px-3 pr-10 z-10 ellipsis group/task  noSelect cursor-pointer border-main-7 border flex items-center justify-center"
        >
            <div
                className=" h-fit w-full  text-sm   ellipsis text-main-1 font-bold !whitespace-nowrap  group-hover/task:text-main-7 group-hover/task:opacity-80 group-hover/task:brightness-150 noSelect transition-all duration-300 ease-in-out">{task?.title}</div>
        </div>
    );
};
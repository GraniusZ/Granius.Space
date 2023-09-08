import {FC, useMemo} from "react";
import {ColumnType} from "types/ColumnType.ts";
import {ReactComponent as ThreeDots} from "@assets/icons/ThreeDotsIcon.svg";
import {useOutletContext} from "react-router-dom";
import {TasksListType} from "types/TasksListType.ts";
import {TaskType} from "types/TaskType.ts";
import {SortableContext} from "@dnd-kit/sortable";
import {Task} from "@modules/Board/components/Task.tsx";


type ColumnOverlayType = {
    column: ColumnType
}
type ContextType = { localTasksList: TasksListType[] };

export const ColumnOverlay: FC<ColumnOverlayType> = ({column}) => {

    const {localTasksList: tasksListArray} = useOutletContext<ContextType>()
    const columnTasksList = tasksListArray.find((task) => {
        return task.id === column.id
    })

    const tasks = columnTasksList?.tasks || []
    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);
    return (
        <div
            className="h-full  min-w-[250px] w-[250px] sm:min-w-[300px] sm:w-[300px] ">
            <div
                className=" z-10  noSelect  py-4 flex flex-col justify-center w-full gap-4 rounded-lg ellipsis relative overflow-visible float-left bg-main-1 max-h-full ">
                <div className="w-full h-fit flex flex-row items-center min-w-full z-50 px-3">
                    <div className="w-full h-fit flex items-center justify-between ellipsis"
                    >   <span
                        className="text-main-6 brightness-125 text-lg font-semibold ellipsis pr-6 z-20 pl-4 ">{column.title}</span>
                    </div>

                    <div className="flex justify-center items-center group/dotsmenu relative p-1 rounded-lg z-50"
                    >
                        <ThreeDots className="w-[20px] h-[20px] z-10 fill-main-6"/>
                        <div
                            className=" w-full h-full absolute rounded-lg brightness-150  opacity-60 group-hover/dotsmenu:bg-main-3 transition-all duration-200 ease-in-out"
                        ></div>

                    </div>

                </div>


                <div className=" justify-start bg-main-1 gap-6  flex flex-col flex-1 overflow-y-auto h-fit px-3 ">
                    <SortableContext items={tasksIds}>
                        {tasks.map((task: TaskType) =>
                            (
                                <Task key={task.id} task={task} id={task.id}/>
                            ))}
                    </SortableContext>

                </div>


                <div className="w-full  z-10 px-3  ">
                    <div
                        className=" py-2 group/task noSelect cursor-pointer relative flex justify-center items-center h-fit"
                    >
                             <span
                                 className="h-full w-full text-sm flex items-center text-main-1 brightness-75 font-bold break-words  noSelect transition-all duration-300 ease-in-out px-3">Add
                            New Task
                        </span>


                    </div>

                </div>
            </div>

        </div>
    );
}

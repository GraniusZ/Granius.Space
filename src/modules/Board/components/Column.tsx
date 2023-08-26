import {FC, memo, useRef} from "react";
import {ColumnType} from "types/ColumnType.ts";
import {ReactComponent as ThreeDots} from "@assets/icons/ThreeDotsIcon.svg";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {AnimatePresence} from "framer-motion";
import {ColumnSettings} from "@modules/Board/components/ColumnSettings.tsx";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setActiveColumn, setAddTask, setColumnSettings, setColumnTitleInput} from "@store/slices/boardPageSlice.ts";
import {TasksListType} from "types/TasksListType.ts";
import {TaskType} from "types/TaskType.ts";
import {Task} from "@modules/Board/components/Task.tsx";
import {AddNewTask} from "@modules/Board/components/AddNewTask.tsx";
import {ColumnTitleChange} from "@modules/Board/components/ColumnTitleChange.tsx";
import {rectSortingStrategy, SortableContext, useSortable,} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';


type ColumnCompType = {
    column: ColumnType,
    id: string,
    tasksList: TasksListType[]
}


export const Column: FC<ColumnCompType> = memo(({column, id, tasksList}) => {

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
            type: "Column",
            column,
        },

    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        willChange: "transform",

    };

    const isAddTaskOpened = useAppSelector((state) => state.boardPage.addTask)
    const isColumnSettingsOpened = useAppSelector((state) => state.boardPage.columnSettings);
    const isColumnTitleChangeOpened = useAppSelector((state) => state.boardPage.titleColumnChange);
    const activeColumn: ColumnType = useAppSelector((state) => state.boardPage.activeColumn)

    const columnTasksList = tasksList.find((task) => {
        return task.id === column.id
    })

    const addNewTaskRef = useRef<HTMLDivElement>(null)
    const handleOpenAddTask = () => {
        dispatch(setAddTask(true))


        dispatch(setActiveColumn(column))
        dispatch(setColumnSettings(false))
        dispatch(setColumnTitleInput(false))
        addNewTaskRef.current?.scrollIntoView()

    }
    const handleClickOnCol = () => {
        dispatch(setAddTask(false))
        dispatch(setColumnSettings(false))
        dispatch(setActiveColumn({}))
        dispatch(setColumnTitleInput(true))
    }
    const handleOpenChangeColumnTitle = () => {
        dispatch(setAddTask(false))
        dispatch(setColumnSettings(false))
        dispatch(setActiveColumn(column))
        dispatch(setColumnTitleInput(true))
    }

    const tasks = columnTasksList?.tasks || []
    const dispatch = useAppDispatch()
    const handleOpenColumnSettings = () => {
        if (activeColumn == column) {
            dispatch(setActiveColumn({}))
        } else {
            dispatch(setActiveColumn(column))

        }
        dispatch(setColumnTitleInput(false))
        dispatch(setColumnSettings(true))
        dispatch(setAddTask(false))

    }

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className=" h-full  min-h-full sm:min-w-[300px] sm:w-[300px] min-w-full w-full ">
            <div
                className=" z-10  noSelect  py-4 flex flex-col justify-center w-full gap-4 rounded-lg ellipsis relative overflow-visible float-left bg-main-1 max-h-full ">
                <div className="w-full h-fit flex flex-row items-center min-w-full z-50 px-3">
                    <div className="w-full h-fit flex items-center justify-between ellipsis"
                         onClick={handleOpenChangeColumnTitle}>   {(isColumnTitleChangeOpened && activeColumn.id == column.id) ?
                        <ColumnTitleChange title={column.title}/> : <span
                            className="text-main-6 brightness-125 text-lg font-semibold ellipsis pr-6 z-20 pl-4 ">{column.title}</span>}
                    </div>

                    <div className="flex justify-center items-center group/dotsmenu relative p-1 rounded-lg z-50"
                         onClick={handleOpenColumnSettings}>
                        <ThreeDots className="w-[20px] h-[20px] z-10 fill-main-6"/>
                        <div
                            className=" w-full h-full absolute rounded-lg brightness-150  opacity-60 group-hover/dotsmenu:bg-main-3 transition-all duration-200 ease-in-out"
                        ></div>

                    </div>
                    <AnimatePresence>{isColumnSettingsOpened && <ColumnSettings column={column}/>}</AnimatePresence>
                </div>


                <div className=" justify-start bg-main-1 gap-6  flex flex-col flex-1 overflow-y-auto h-fit px-3 "
                     onClick={handleClickOnCol}>
                    <SortableContext items={tasks} strategy={rectSortingStrategy}>
                        {tasks.map((task: TaskType) =>
                            (
                                <Task key={task.id} task={task} id={task.id}/>
                            ))}
                    </SortableContext>

                </div>


                <div className="w-full  z-10 px-3  ">     {(!isAddTaskOpened || activeColumn.id != column.id) ?
                    <div
                        className=" py-2 group/task noSelect cursor-pointer relative flex justify-center items-center h-fit"
                        onClick={handleOpenAddTask}>
                             <span
                                 className="h-full w-full text-sm flex items-center text-main-1 brightness-75 font-bold break-words group-hover/task:text-main-7 group-hover/task:opacity-80 group-hover/task:brightness-150 noSelect transition-all duration-300 ease-in-out px-3">Add
                            New Task
                        </span>


                    </div> : <AddNewTask tasks={tasks} columnId={column.id}/>}

                </div>
            </div>

        </div>
    );
});
import {FC, useEffect, useRef, useState} from "react";
import {Header} from "@modules/Board/components/Header.tsx";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {usePageTitle} from "@hooks/usePageTitle.ts";
import {Columns} from "@modules/Board/components/Columns.tsx";
import {createPortal} from "react-dom";
import {AnimatePresence} from "framer-motion";
import {MobileSideMenu} from "@modules/Board/components/MobileSideMenu.tsx";
import {ColumnType} from "types/ColumnType.ts";
import {SideMenu} from "@modules/Board/components/SideMenu.tsx";
import {useOutletContext} from "react-router-dom";
import {BoardType} from "types/BoardType.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setActiveId} from "@store/slices/boardMenuSlice.ts";
import {useGetTasksListQuery, useSwapColumnsMutation, useSwapTasksMutation} from "@/api/boardApi";
import {TasksListType} from "types/TasksListType.ts";
import {
    setActiveColumn,
    setActiveTask,
    setAddColumn,
    setAddTask,
    setColumnSettings,
    setColumnTitleInput
} from "@store/slices/boardPageSlice.ts";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";
import {ColumnOverlay} from "@modules/Board/components/ColumnOverlay.tsx";
import {TaskOverlay} from "@modules/Board/components/TaskOverlay.tsx";

type ContextType = { localBoard: BoardType, localColumns: ColumnType[] };
export const Board: FC = () => {
    const addNewColRef = useRef<HTMLDivElement>(null)
    const isOpenedSideMenu = useAppSelector(state => state.boardPage.sideMenu)
    const {localBoard: board, localColumns: columns} = useOutletContext<ContextType>()
    const activeId = useAppSelector((state) => state.boardMenu.activeId);
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(setActiveId(board.id))
    }, [activeId, dispatch])
    usePageTitle(board?.title);
    const user = useAppSelector((state) => state.user.user);
    const boardId = useAppSelector((state) => state.boardMenu.activeId);
    const [handleSwapColumns] = useSwapColumnsMutation()
    const [handleSwapTasks] = useSwapTasksMutation()
    const {data: tasksList} = useGetTasksListQuery({userId: user?.uid, boardId: boardId, columns: columns}, {skip: !columns || !user.uid || !boardId})
    const boardList = tasksList || []

    const activeColumn = useAppSelector((state) => state.boardPage.activeColumn);
    const activeTask = useAppSelector((state) => state.boardPage.activeTask);
    useEffect(() => {
        if (JSON.stringify(oldTasksList) !== JSON.stringify(boardList)) {
            setOldTasksList(boardList)
            setLocalTasksList(boardList)
        }
    }, [tasksList]);
    const [oldTasksList, setOldTasksList] = useState<TasksListType[]>([])
    const [localTasksList, setLocalTasksList] = useState<TasksListType[]>([])




    const [activeIdDnd, setActiveIdDnd] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 16,
            },

        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 150,
                tolerance: 8,
            },
        }),
    );

    function handleDragStart(event: DragStartEvent) {
        const {id} = event.active;
        const idString = String(id); // Convert id to a string if it's a number

        setActiveIdDnd(idString);
        dispatch(setColumnTitleInput(false))
        dispatch(setAddTask(false))
        dispatch(setColumnSettings(false))
        dispatch(setAddColumn(false))
        dispatch(setActiveColumn(null))
        dispatch(setActiveTask(null))


        if (event.active.data.current?.type === "Column") {
            dispatch(setActiveColumn(event.active.data.current.column));
            return;
        }

        if (event.active.data.current?.type === "Task") {

            dispatch(setActiveTask(event.active.data.current.task));
            return;
        }

    }

    const handleDragEnd = async (event: DragEndEvent) => {
        dispatch(setActiveColumn(null))
        dispatch(setActiveTask(null))
        const {active, over} = event;
        if (!over) return;
        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;

        const isActiveAColumn = active.data.current?.type === "Column";
        if (!isActiveAColumn) return;

        const activeIndex = columns.findIndex((col) => col.id === active.id);
        const overIndex = columns.findIndex((col) => col.id === over.id);
        const updCols = arrayMove(columns, activeIndex, overIndex)
        handleSwapColumns({columns: updCols, userId: user.uid, boardId: boardId})


        setActiveIdDnd(null);


    };
    const handleDragOver = (event: DragOverEvent) => {
        const {active, over} = event;
        if (!over) return;
        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";
        if (isActiveATask && isOverATask) {
            if (activeId === overId) return;
            console.log(123)
            const activeColumn = localTasksList.find(list => list.tasks.some(task => task.id === active.id));
            const overColumn = localTasksList.find(list => list.tasks.some(task => task.id === over.id));
            if (!activeColumn || !overColumn) {

                return;
            }
            const activeTasks = [...activeColumn.tasks]
            const overTasks = [...overColumn.tasks]

            const activeIndex = activeColumn.tasks.findIndex((task) => task.id === active.id);
            const overIndex = overTasks.findIndex((task) => task.id === over.id);
            if (activeColumn.id != overColumn.id) {
                const movedTask = activeTasks.splice(activeIndex, 1)[0];

                // Вставляємо задачу до колонки overColumn
                overTasks.splice(overIndex, 0, movedTask);

                // Оновлюємо стан localTasksList з оновленими задачами
                setLocalTasksList(prevTasksList => {
                    return prevTasksList.map(list => {
                        if (list.id === activeColumn.id) {
                            return {
                                ...list,
                                tasks: activeTasks,
                            };
                        }
                        if (list.id === overColumn.id) {
                            return {
                                ...list,
                                tasks: overTasks,
                            };
                        }
                        return list;
                    });
                });

                handleSwapTasks({
                    columns: columns,
                    userId: user.uid,
                    boardId: boardId,
                    tasks: overTasks,
                    columnId: overColumn.id,
                    addedTask: movedTask
                });
                handleSwapTasks({
                    columns: columns,
                    userId: user.uid,
                    boardId: boardId,
                    tasks: activeTasks,
                    columnId: activeColumn.id,
                    removedTask: movedTask
                });

                return;
            }

            const updTasks = arrayMove(activeTasks, activeIndex, overIndex)
            handleSwapTasks({columns: columns, userId: user.uid, boardId: boardId, tasks: updTasks, columnId: activeColumn?.id})
            setLocalTasksList((prevOldTasksList) => {
                return prevOldTasksList.map((list) => {
                    if (list.id === activeColumn.id) {
                        return {
                            ...list,
                            tasks: updTasks,
                        };
                    }
                    return list;
                });
            });

            return
        }

        //
        // if (isActiveATask && isOverAColumn) {
        //     if (activeId === overId) return;
        //     const activeColumn = localTasksList.find(list => list.tasks.some(task => task.id === active.id));
        //     const overColumn = localTasksList.find(list => list.id === over.id);
        //     if (!activeColumn || !overColumn) {
        //         return;
        //     }
        //     if (JSON.stringify( activeColumn )== JSON.stringify(overColumn) ){
        //         return;
        //     }
        //     const activeTasks = [...activeColumn.tasks]
        //     const overTasks = [...overColumn.tasks];
        //     if (JSON.stringify( activeTasks )== JSON.stringify(overTasks) ){
        //         return;
        //     }
        //     const activeIndex = activeColumn.tasks.findIndex(task => task.id === active.id);
        //     const movedTask = activeTasks.splice(activeIndex, 1)[0];
        //     overTasks.splice(overTasks.length, 0, movedTask);
        //     setLocalTasksList(prevTasksList => {
        //         return prevTasksList.map(list => {
        //             if (list.id === activeColumn.id) {
        //                 return {
        //                     ...list,
        //                     tasks: activeTasks,
        //                 };
        //             }
        //             if (list.id === over.id) {
        //                 return {
        //                     ...list,
        //                     tasks: overTasks,
        //                 };
        //             }
        //             return list;
        //         });
        //     });
        //     handleSwapTasks({
        //         columns: columns,
        //         userId: user.uid,
        //         boardId: boardId,
        //         tasks: overTasks,
        //         columnId: overColumn.id,
        //         addedTask: movedTask,
        //
        //     });
        //
        //     handleSwapTasks({
        //         columns: columns,
        //         userId: user.uid,
        //         boardId: boardId,
        //         tasks: activeTasks,
        //         columnId: activeColumn.id,
        //         removedTask: movedTask,
        //     });
        //
        //
        // }
    }
    return (
        <DndContext sensors={sensors}

                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}>
            <div className="w-full h-full bg-main-3">

                <div className="flex flex-col w-full h-full">

                    <div className="w-full h-full">

                        <div className="w-full h-full flex flex-row relative">
                            <SideMenu/>
                            <div className="w-full h-full flex flex-col">
                                <Header data={board}/>
                                <div className="flex flex-row w-full h-full relative  bg-main-2"
                                     ref={addNewColRef}>

                                    {
                                        createPortal(<AnimatePresence>{isOpenedSideMenu &&
                                            <MobileSideMenu/>}</AnimatePresence>, document.body)
                                    }
                                    <Columns columns={columns} tasksList={localTasksList}/>
                                    {createPortal(
                                        <DragOverlay dropAnimation={{
                                            duration: 100,
                                            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                                        }}>
                                            {(activeIdDnd && activeColumn) && (
                                                <ColumnOverlay column={activeColumn}/>
                                            )}
                                            {(activeIdDnd && activeTask) && (
                                                <TaskOverlay task={activeTask}/>
                                            )}
                                        </DragOverlay>, document.body)}
                                </div>


                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </DndContext>
    );
};
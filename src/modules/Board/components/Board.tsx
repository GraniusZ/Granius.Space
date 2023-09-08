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
import {
    setActiveColumn,
    setActiveTask,
    setAddColumn,
    setAddTask,
    setColumnSettings,
    setColumnTitleInput
} from "@store/slices/boardPageSlice.ts";
import {
    closestCenter,
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
    }, [activeId, dispatch, board.id])
    usePageTitle(board?.title);
    const user = useAppSelector((state) => state.user.user);
    const boardId = useAppSelector((state) => state.boardMenu.activeId);
    const [handleSwapColumns] = useSwapColumnsMutation()
    const [handleSwapTasks] = useSwapTasksMutation()
    const {data: tasksList} = useGetTasksListQuery({userId: user?.uid, boardId: boardId, columns: columns}, {skip: !columns || !user.uid || !boardId})
    const boardList = tasksList || []
    const activeColumn = useAppSelector((state) => state.boardPage.activeColumn);
    const activeTask = useAppSelector((state) => state.boardPage.activeTask);





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
        const isOverAColumn = over.data.current?.type === "Column"
        if (isActiveATask && isOverATask) {
            if (activeId === overId) return;

            const updatedBoardList = boardList.map(column => ({
                ...column,
                tasks: column.tasks.map(task => ({...task})),
            }));

            const activeColumnIndex = updatedBoardList.findIndex(column => column.tasks.some(task => task.id === activeId));
            const overColumnIndex = updatedBoardList.findIndex(column => column.tasks.some(task => task.id === overId));

            if (activeColumnIndex === -1 || overColumnIndex === -1) {
                return;
            }

            const activeColumn = updatedBoardList[activeColumnIndex];
            const overColumn = updatedBoardList[overColumnIndex];

            const activeTaskIndex = activeColumn.tasks.findIndex(task => task.id === activeId);
            const overTaskIndex = overColumn.tasks.findIndex(task => task.id === overId);

            if (activeTaskIndex === -1 || overTaskIndex === -1) {
                return;
            }
            if (activeColumn.id != overColumn.id) {
                const movedTask = activeColumn.tasks[activeTaskIndex];
                activeColumn.tasks.splice(activeTaskIndex, 1); // Remove from source column
                overColumn.tasks.splice(overTaskIndex, 0, movedTask); // Insert into target column
                updatedBoardList[activeColumnIndex] = {
                    ...activeColumn,
                    tasks: [...activeColumn.tasks],
                };
                updatedBoardList[overColumnIndex] = {
                    ...overColumn,
                    tasks: [...overColumn.tasks],
                };

                handleSwapTasks({
                    columns: columns,
                    userId: user.uid,
                    boardId: boardId,
                    tasksList: updatedBoardList,
                    activeColumnId: activeColumn.id,
                    overColumnId: overColumn.id,
                    addedTask: movedTask,
                    deletedTask: movedTask,
                });


                return;
            }
            const movedTask = activeColumn.tasks.splice(activeTaskIndex, 1)[0];
            overColumn.tasks.splice(overTaskIndex, 0, movedTask);
            updatedBoardList[activeColumnIndex] = {
                ...activeColumn,
                tasks: [...activeColumn.tasks],
            };
            updatedBoardList[overColumnIndex] = {
                ...overColumn,
                tasks: [...overColumn.tasks],
            };

            handleSwapTasks({
                columns: columns,
                userId: user.uid,
                boardId: boardId,
                tasksList: updatedBoardList,
                activeColumnId: activeColumn.id,
                overColumnId: overColumn.id
            })

            return
        }


        if (isActiveATask && isOverAColumn) {
            if (activeId === overId) return;
            const updatedBoardList = boardList.map(column => ({
                ...column,
                tasks: column.tasks.map(task => ({...task})),
            }));

            const activeColumnIndex = updatedBoardList.findIndex(column => column.tasks.some(task => task.id === activeId));
            const overColumnIndex = updatedBoardList.findIndex(column => column.id === over.id);
            const activeColumn = updatedBoardList[activeColumnIndex];
            const overColumn = updatedBoardList[overColumnIndex];
            const activeTaskIndex = activeColumn.tasks.findIndex(task => task.id === activeId);
            if (!activeColumn || !overColumn) {
                return;
            }
            if (JSON.stringify( activeColumn )== JSON.stringify(overColumn) ){
                return;
            }
            const activeTasks = [...activeColumn.tasks]
            const overTasks = [...overColumn.tasks];
            if (JSON.stringify( activeTasks )== JSON.stringify(overTasks) ){
                return;
            }
            const isTaskAlreadyInOverColumn = overColumn.tasks.some(task => task.id === activeId);

            if (isTaskAlreadyInOverColumn) {
                return;
            }
            const movedTask = activeColumn.tasks[activeTaskIndex];
            activeColumn.tasks.splice(activeTaskIndex, 1);
            overColumn.tasks.splice(overColumn.tasks.length, 0, movedTask);
            updatedBoardList[activeColumnIndex] = {
                ...activeColumn,
                tasks: [...activeColumn.tasks],
            };
            updatedBoardList[overColumnIndex] = {
                ...overColumn,
                tasks: [...overColumn.tasks],
            };
            handleSwapTasks({
                columns: columns,
                userId: user.uid,
                boardId: boardId,
                tasksList: updatedBoardList,
                activeColumnId: activeColumn.id,
                overColumnId: overColumn.id,
                addedTask: movedTask,
                deletedTask: movedTask,
            });
            return;


        }
    }

    return (
        <DndContext sensors={sensors}
                    collisionDetection={closestCenter}
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
                                    <Columns columns={columns} tasksList={boardList}/>
                                    {createPortal(
                                        <DragOverlay dropAnimation={{
                                            duration: 0,
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
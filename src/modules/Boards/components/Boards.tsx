import {FC, memo, useState} from "react";

import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {BoardCard} from "@modules/Boards/components/BoardCard.tsx";


import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {rectSortingStrategy, SortableContext} from '@dnd-kit/sortable';
import {BoardType} from "types/BoardType.ts";
import {createPortal} from "react-dom";
import {BoardCardOverlay} from "@modules/Boards/components/BoardCardOverlay.tsx";
import {BoardsMenu} from "@modules/Boards/components/BoardsMenu.tsx";
import {useGetBoardsQuery, useSwapBoardsMutation} from "@/api/boardsApi.ts";

export const Boards: FC = memo(function () {
    const [handleSwap] = useSwapBoardsMutation()
    const user = useAppSelector((state) => state.user.user);
    const {data} = useGetBoardsQuery(user.uid, {skip: !user.uid});
    const localBoards = data || [];
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeTitle, setActiveTitle] = useState<string>("");
    const [activeDescription, setActiveDescription] = useState<string>("");

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
        setActiveId(idString);

        // Find the board with the corresponding id
        const activeBoard = localBoards.find((board: BoardType) => board.id === id);

        if (activeBoard) {
            const {title, description} = activeBoard;
            setActiveTitle(title);
            setActiveDescription(description);
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const {active, over} = event;

        if (over && active.id !== over.id) {
            const newBoards = [...localBoards];
            const activeIndex = newBoards.findIndex((board) => board.id === active.id);
            const overIndex = newBoards.findIndex((board) => board.id === over.id);

            // Remove the active board from the array
            const [draggedBoard] = newBoards.splice(activeIndex, 1);

            newBoards.splice(overIndex, 0, draggedBoard);

            handleSwap({data: newBoards, userId: user.uid})
            setActiveId(null);
            setActiveTitle("")
            setActiveDescription("")
        }
    };


    return (
        <div className="flex flex-row w-full h-full relative box-border">
            <BoardsMenu/>
            <div className="w-full h-full max-h-full bg-main-2 relative z-0">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                >
                    <div className="w-full h-full relative flex justify-center overflow-y-scroll">
                        <div
                            className=" absolute Grid  px-5 py-10 w-full box-border ">


                            <SortableContext
                                items={localBoards}
                                strategy={rectSortingStrategy}

                            >
                                {localBoards.map((board: BoardType) => (
                                    <div key={board.id}>
                                        <BoardCard id={board.id} title={board.title} description={board.description}/>
                                    </div>


                                ))}
                            </SortableContext>
                            {createPortal(<DragOverlay dropAnimation={{
                                duration: 250,
                                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                            }}>
                                {activeId ? (
                                    <BoardCardOverlay title={activeTitle} description={activeDescription}/>
                                ) : null}
                            </DragOverlay>, document.body)}


                        </div>
                    </div>
                </DndContext>

            </div>

        </div>

    );
});


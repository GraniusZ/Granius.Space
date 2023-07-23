import {FC, memo, useState} from "react";
import useRealtimeFirestoreBoards from "../hooks/useRealtimeFirestoreBoards.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {BoardCard, BoardCardProps} from "@modules/BoardMenu/components/BoardCard.tsx";

import {collection, CollectionReference, doc, writeBatch} from "firebase/firestore";

import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {db} from "@/config/firebase";
import {setBoards} from "@store/slices/userSlice.ts";
import {BoardType} from "types/BoardType.ts";
import {createPortal} from "react-dom";
import {BoardCardOverlay} from "@modules/BoardMenu/components/BoardCardOverlay.tsx";
import {BoardsMenu} from "@modules/BoardMenu/components/BoardsMenu.tsx";

export const Boards: FC = memo(function () {

    const user = useAppSelector((state) => state.user.user);
    useRealtimeFirestoreBoards(user.uid, true);
    const dispatch = useAppDispatch();
    const localBoards = useAppSelector((state) => state.user.boards);

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
                delay: 300,
                tolerance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
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

            // Insert the active board at the new position
            newBoards.splice(overIndex, 0, draggedBoard);


            const collectionRef: CollectionReference = collection(db, `users/${user.uid}/boards`);

            // Create a write batch
            const batch = writeBatch(db);

            // Update the order of all boards based on their new index in the batch
            newBoards.forEach((board: BoardType, index: number) => {
                const docRef = doc(collectionRef, board.id);
                batch.update(docRef, {order: index});
            });
            dispatch(setBoards(newBoards));

            // Commit the batch to execute all update operations at once
            await batch.commit();
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
                            className=" absolute  w-[80%] flex flex-col pt-10 pb-10 gap-12 box-border ">


                            <SortableContext
                                items={localBoards}
                                strategy={verticalListSortingStrategy}

                            >
                                {localBoards.map((board: BoardCardProps) => (
                                    <div key={board.id} className="flex justify-center">
                                        <BoardCard id={board.id} title={board.title} description={board.description}/>
                                    </div>


                                ))}
                            </SortableContext>
                            {createPortal(<DragOverlay dropAnimation={{
                                duration: 300,
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


import {FC} from "react";
import useRealtimeFirestoreBoards from "../hooks/useRealtimeFirestoreBoards.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {BoardCard, BoardCardProps} from "@modules/BoardMenu/components/BoardCard.tsx";
import {ReactComponent as AddIcon} from "@assets/icons/AddIcon.svg";
import {ReactComponent as SettingsIcon} from "@assets/icons/SettingsIcon.svg";
import {Link} from "react-router-dom";
import { writeBatch } from "firebase/firestore";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from '@dnd-kit/sortable';
import { doc, collection, CollectionReference} from "firebase/firestore";
import { db } from "@/config/firebase";
import { setBoards } from "@store/slices/userSlice.ts";
import {setClosed, setOpenBoardCreate} from "@store/slices/boardMenuSlice.ts";
import {BoardType} from "types/BoardType.ts";

export const BoardsMenu: FC = () => {
    const burgerMenuOpened = useAppSelector(state => state.boardMenu.opened)
    const user = useAppSelector((state) => state.user.user);
    useRealtimeFirestoreBoards(user.uid, true);
    const dispatch = useAppDispatch();
    const localBoards = useAppSelector((state) => state.user.boards);

    const handleCloseBoardMenu = () => {
        dispatch(setClosed());
    };
    const handleOpenBoardCreateMenu = () =>{
        dispatch(setOpenBoardCreate());
    }


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

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

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
            newBoards.forEach((board:BoardType, index:number) => {
                const docRef = doc(collectionRef, board.id);
                batch.update(docRef, { order: index });
            });
            dispatch(setBoards(newBoards));

            // Commit the batch to execute all update operations at once
            await batch.commit();
        }
    };


    return (
        <div className="flex flex-row w-full h-full relative box-border">
            <div
                className={`h-full w-full max-w-sm md:max-w-[350px] bg-main-3 drop-shadow-xl mb-4 absolute  md:relative z-20 ${burgerMenuOpened ? " left-0" : "left-[-110%]"}  md:block md:opacity-100 md:left-0  transition-all  ease-out  duration-200 `}>

                <div className="w-full flex flex-col p-6 gap-2 justify-center  relative">
                    <button
                        className="w-full flex gap-4 text-lg items-center text-main-4 relative py-4 active:scale-[1.02] ease-in-out duration-300 cursor-pointer"
                    onClick={handleOpenBoardCreateMenu}>
                        <AddIcon className="w-[20px] h-[20px] ml-1"/>
                        <span>Add new board</span>
                        <div
                            className="w-full h-full absolute bg-main-4 rounded-lg opacity-0 hover:opacity-30 ease-in-out duration-200"></div>
                    </button>
                    <Link to="/"
                          className="w-full flex gap-4 text-lg items-center text-main-4 relative py-4 active:scale-[1.02] ease-in-out duration-300">
                        <SettingsIcon className="w-[20px] h-[20px] ml-1"/>
                        <span>Settings</span>
                        <div
                            className="w-full h-full absolute bg-main-4 rounded-lg opacity-0 hover:opacity-30 ease-in-out duration-200"></div>
                    </Link>
                </div>

            </div>
            {<div className={` ${burgerMenuOpened ? " visible opacity-80" : " hidden"} absolute w-full h-full z-10 md:hidden bg-main-1 transition-opacity  ease-out  duration-200 `} onClick={handleCloseBoardMenu}>

            </div>}
            <div className="absolute w-full ">
                <div
                    className={`bg-main-2 w-full  visible md:hidden ${burgerMenuOpened ? "visible opacity-100" : "hidden opacity-0"}`}>

                </div>
            </div>
            <div className="w-full h-full max-h-full bg-main-2 relative  ">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <div className="w-full h-full relative flex justify-center overflow-y-scroll">
                        <div
                            className=" absolute  w-[80%] flex flex-col pt-10 pb-10 gap-12 box-border ">


                            <SortableContext
                                items={localBoards}
                                strategy={verticalListSortingStrategy}

                            >
                                {localBoards.map((board:BoardCardProps) => (
                                    <div key={board.id} className="flex justify-center">
                                        <BoardCard id={board.id} title={board.title} description={board.description}/>
                                    </div>


                                ))}
                            </SortableContext>


                        </div>
                    </div>
                </DndContext>


            </div>

        </div>

    );
};


import {FC, memo, useCallback,} from "react";
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {TrashCan} from "@/ui/TrashCan.tsx";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setDeleteId, setOpenBoardDelete} from "@store/slices/boardMenuSlice.ts";
import {motion} from "framer-motion";

export type BoardCardProps = {
    id: string;
    title: string;
    description: string;
};

export const BoardCard: FC<BoardCardProps> = memo(function BoardCard({id, title, description}: BoardCardProps) {
    const dispatch = useAppDispatch();

    // Extracted outside the component to avoid re-creation on each render
    const handleOpenDeleteBoard = useCallback(() => {
        dispatch(setDeleteId(id));
        dispatch(setOpenBoardDelete());
    }, [dispatch, id]);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        willChange: "transform",

    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="shadow-xl max-w-3xl 2xl:h-72 xl:h-64 h-52 justify-center items-center flex flex-col
                gap-2  overflow-hidden p-3  text-ellipsis font-mono w-full bg-main-4 rounded-xl
                text-main-1 text-lg"
        >
            <div className="w-full px-12 flex justify-center relative items-center ease-in">
                <span className="ellipsis text-xl my-1 md:text-3xl md:my-0 box-border noSelect">{title}</span>
                <div className="absolute w-full flex justify-end items-center ">

                    <button onClick={handleOpenDeleteBoard} className="p-1 relative flex justify-center items-center">
                        <TrashCan/>
                        <motion.div
                            className="absolute w-full h-full opacity-0 rounded-lg bg-main-3 top-0 bottom-0 m-auto "
                            whileHover={{opacity: "80%"}} transition={{duration: 0.2}}></motion.div>
                    </button>

                </div>

            </div>
            <hr className="h-[2px] bg-main-3 border-0 w-full"/>
            <div className="h-full w-full h-max-[80px] ">
                <span
                    className="text-base md:text-lg px-2 break-words 2xl:line-clamp-6 xl:line-clamp-5 line-clamp-4 w-full text-center noSelect"
                >
                    {description}
                </span>
            </div>
        </div>
    );
});
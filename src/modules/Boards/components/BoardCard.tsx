import {FC, memo, useCallback,} from "react";
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {TrashCan} from "@/ui/TrashCan.tsx";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setDeleteId, setOpenBoardDelete} from "@store/slices/boardMenuSlice.ts";

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
            className="shadow-xl max-w-3xl  md:max-w-[600px]
            md:min-w-[350px]
              h-52 justify-center items-center flex flex-col
                gap-2  overflow-hidden p-3  text-ellipsis font-mono w-full bg-main-4 rounded-xl
                text-main-1 text-lg noSelect"
        >
            <div className="w-full md:px-3  px-12 flex justify-center  relative items-center ease-in noSelect">
                <span className="w-full md:mr-12 ellipsis text-2xl my-1 md:text-3xl md:my-0 box-border noSelect text-center font-medium  md:text-start">{title}</span>
                <div className="absolute w-full flex justify-end items-center ">

                    <button onClick={handleOpenDeleteBoard}
                            className="group p-1 relative flex justify-center rounded-lg bg-main-4 items-center scale-90 md:scale-100">
                        <TrashCan/>
                        <div
                            className="absolute w-full h-full opacity-0 group-hover:opacity-60 rounded-lg bg-main-5 top-0 bottom-0 m-auto transition-all duration-500 ease-in-out "
                        ></div>
                    </button>

                </div>

            </div>
            <hr className="h-[2px] bg-main-3 border-0 w-full"/>
            <div className="h-full w-full h-max-[80px] ">
                <span
                    className="text-base md:text-lg px-2 break-words line-clamp-4 w-full text-center  md:text-start  noSelect"
                >
                    {description}
                </span>
            </div>
        </div>
    );
});
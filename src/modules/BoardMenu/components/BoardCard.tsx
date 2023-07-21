import {FC} from "react";
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

export const BoardCard: FC<BoardCardProps> = ({id, title, description}) => {
    const dispatch = useAppDispatch();
    const handleOpenDeleteBoard = () => {
		dispatch(setDeleteId(id))
        dispatch(setOpenBoardDelete());
    };
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
        opacity: isDragging ? 0.5 : 1, // Добавьте стиль прозрачности во время перетаскивания
    };
    return (

        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners} style={style}
            className="shadow-xl max-w-3xl 2xl:h-72 xl:h-64 h-52 justify-center items-center flex flex-col
                gap-2  overflow-hidden p-3  text-ellipsis font-mono w-full bg-main-4 rounded-xl
                text-main-1 text-lg "

        >

            <div className="w-full px-12 flex justify-center relative items-center ease-in">
                <span className=" ellipsis text-3xl  box-border ">{title}</span>
                <button className="absolute right-0 mb-1  " onClick={handleOpenDeleteBoard}><TrashCan/></button>
            </div>


            <hr className="h-[2px] bg-main-3 border-0 w-full"/>
            <div className="h-full w-full h-max-[80px] ">
                <span
                    className="text-xl  px-2  break-words 2xl:line-clamp-6 xl:line-clamp-5 line-clamp-4 w-full text-center">{description}</span>
            </div>

        </div>

    );
};

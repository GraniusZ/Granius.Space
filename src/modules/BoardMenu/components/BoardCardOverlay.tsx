import {FC} from "react";
import {TrashCan} from "@/ui/TrashCan.tsx";


export type BoardCardOverlay = {
    title: string;
    description: string;
};
export const BoardCardOverlay: FC<BoardCardOverlay> = ({title, description}) => {


    return (
        <div

            className="shadow-xl max-w-3xl 2xl:h-72 xl:h-64 h-52 justify-center items-center flex flex-col
                gap-2  overflow-hidden p-3  text-ellipsis font-mono w-full bg-main-4 rounded-xl
                text-main-1 text-lg"
        >
            <div className="w-full px-12 flex justify-center relative items-center ease-in">
                <span className="ellipsis text-xl md:text-3xl box-border">{title}</span>
                <div className="absolute w-full flex justify-end items-center ">

                    <button className="p-1 relative flex justify-center items-center">
                        <TrashCan/>
                        <div
                            className="absolute w-full h-full opacity-0 rounded-lg bg-main-3 top-0 bottom-0 m-auto "
                        ></div>
                    </button>

                </div>
            </div>
            <hr className="h-[2px] bg-main-3 border-0 w-full"/>
            <div className="h-full w-full h-max-[80px] ">
                <span
                    className="text-base md:text-lg px-2 break-words 2xl:line-clamp-6 xl:line-clamp-5 line-clamp-4 w-full text-center"
                >
                    {description}
                </span>
            </div>
        </div>
    );
}

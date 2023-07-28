import {FC} from "react";
import {TrashCan} from "@/ui/TrashCan.tsx";
import {motion} from "framer-motion";


export type BoardCardOverlay = {
    title: string;
    description: string;
};
export const BoardCardOverlay: FC<BoardCardOverlay> = ({title, description}) => {


    return (
        <div

            className="shadow-xl max-w-3xl  md:max-w-[600px]
            md:min-w-[350px]
              h-52 justify-center items-center flex flex-col
                gap-2  overflow-hidden p-3  text-ellipsis font-mono w-full bg-main-4 rounded-xl
                text-main-1 text-lg noSelect"
        >
            <div className="w-full md:px-3  px-12 flex justify-center  relative items-center ease-in noSelect">
                <span className="w-full md:pr-8 ellipsis text-2xl my-1 md:text-3xl md:my-0 box-border noSelect text-center font-medium  md:text-start">{title}</span>
                <div className="absolute w-full flex justify-end items-center ">

                    <button className="p-1 relative flex justify-center items-center scale-90 md:scale-100">
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
                    className="text-base md:text-lg px-2 break-words line-clamp-4 w-full text-center  md:text-start  noSelect"
                >
                    {description}
                </span>
            </div>
        </div>
    );
}

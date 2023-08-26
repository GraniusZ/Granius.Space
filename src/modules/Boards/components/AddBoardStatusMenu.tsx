import {Dispatch, FC} from "react";
import {statuses} from "@/const/statuses";
import {StatusType} from "types/StatusType.ts";
import {motion} from "framer-motion";

type AddBoardStatusMenu = {
    setStatus: Dispatch<StatusType>
}
export const AddBoardStatusMenu: FC<AddBoardStatusMenu> = ({setStatus}) => {


    return (
        <motion.div
            className="absolute mt-2 h-fit w-fit max-h-44 overflow-y-scroll bg-main-1 brightness-150 z-20 rounded-lg shadow-xl flex flex-col  !whitespace-nowrap"
            initial={{scaleX: 0.9, scaleY: 0.9}} animate={{scaleX: 1, scaleY: 1}} exit={{scaleX: 0.9, scaleY: 0.9}}
            transition={{ease: "linear", duration: 0.05}}>
            {statuses
                .filter((status) => (status.status !== "Canceled" && status.status !== "Completed"))
                .map((status: StatusType, index: number) => (
                    <div
                        key={index}
                        className="flex flex-row gap-4 items-center w-full hover:bg-main-2 px-6 z-10 py-2"
                        onClick={() => setStatus(status)}
                    >
                        <div style={{ background: status.color }} className="h-4 w-4 rounded-full"></div>
                        <div className="mr-24 text-main-4">{status.status}</div>
                    </div>
                ))}
        </motion.div>
    );
};
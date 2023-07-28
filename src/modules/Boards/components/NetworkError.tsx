import {FC} from "react";
import {motion} from "framer-motion";

export const NetworkError: FC = () => {
    return (
        <motion.div className="absolute bottom-0  md:bottom-[3%] w-full md:w-80 h-fit md:h-36 bg-main-3 z-50 rounded-sm shadow-2xl px-4 py-2 flex flex-col gap-1 text-main-4 mr-[-3%]"   initial={{right:"-100%"}}
             animate={{right:"3%"}}
             exit={{right:"-100%"}}
             transition={{ease: "linear", duration: 0.3}}>
            <span className="text-lg font-semibold">There is no network connection</span>
            <span className="text-base hidden md:inline">You cannot perform this operation until you are connected to the network</span>
        </motion.div>
    );
};
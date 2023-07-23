import {FC} from "react";
import {ReactComponent as CloseIcon} from "@assets/icons/CloseIcon.svg";
import {motion} from "framer-motion";

type CloseType = {
    onClick: () => void;
}
export const Close: FC<CloseType> = ({onClick}) => {
    return (
        <motion.div onClick={onClick} className="w-12 h-12 flex justify-center align-center relative noSelect"
                    whileTap={{scale: 0.97, transition: {duration: 0.1}}}>
            <CloseIcon className="w-8 h-8 absolute top-0 bottom-0 m-auto"/>
            <motion.div className="w-full h-full  bg-main-4 rounded-lg opacity-0" initial={{opacity: 0}} whileHover={{
                opacity: "30%",
                transition: {duration: 0.2}
            }}></motion.div>
        </motion.div>
    );
};
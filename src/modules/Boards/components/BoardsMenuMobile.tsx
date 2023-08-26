import {FC} from "react";
import {motion} from "framer-motion";
import {BoardsMenuInside} from "@modules/Boards/components/BoardsMenuInside.tsx";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setMenuClosed} from "@store/slices/boardMenuSlice.ts";

export const BoardsMenuMobile: FC = () => {
    const dispatch = useAppDispatch();
    const handleCloseBoardMenu = () => {
        dispatch(setMenuClosed());
    };
    return (
        <div className="z-50">
            <motion.div
                className=" top-0 h-full w-full sm:max-w-sm md:max-w-[250px] max-w-full  bg-main-3 drop-shadow-xl mb-4 absolute  md:relative z-50 visible block  md:left-0 md:hidden "
                initial={{left: "-100%"}}
                animate={{left: "0"}}
                exit={{left: "-100%"}}
                transition={{ease: "easeInOut", duration: 0.1}}><BoardsMenuInside/></motion.div>

            <motion.div className={` absolute w-full h-full z-30 md:hidden bg-main-1 top-0`}
                        onClick={handleCloseBoardMenu}
                        initial={{opacity: "0%"}}
                        animate={{opacity: "80%"}}
                        exit={{opacity: "0%"}}
                        transition={{ease: "linear", duration: 0.1}}>

            </motion.div>
        </div>
    );
};
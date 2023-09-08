import {FC} from "react";
import {ReactComponent as LeftArrowIcon} from "@assets/icons/LeftArrowIcon.svg";
import {ReactComponent as CloseIcon} from "@assets/icons/CloseIcon.svg";
import {Link} from "react-router-dom";
import {motion} from "framer-motion";
import {setSideMenu} from "@store/slices/boardPageSlice.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {ReactComponent as SettingsIcon} from "@assets/icons/SettingsIcon.svg";
import {setBoardInfo} from "@store/slices/boardMenuSlice.ts";

export const MobileSideMenu: FC = () => {
    const dispatch = useAppDispatch()
    const handleClose = () => {
        dispatch(setSideMenu(false))
    }
    const handleOpenBoardInfo = () => {
        dispatch(setBoardInfo(true))
    }
    return (
        <>
            <motion.div className={`absolute md:!hidden flex top-0 bg-main-1 h-full z-50 py-6 flex-col px-2 gap-16 `}
                        initial={{left: "-100%"}}
                        animate={{left: "0"}}
                        exit={{left: "-100%"}}
                        transition={{ease: "easeInOut", duration: 0.1}}>
                <button
                    className="mx-1 p-2 relative flex justify-center rounded-lg border-main-4 bg-main-2  active:scale-105 items-center group transition-all duration-200 ease-in-out"
                    onClick={handleClose}>
                    <CloseIcon className="w-[25px] h-[25px] z-20"/>
                    <div
                        className="w-full h-full absolute rounded-lg opacity-60 group-hover:bg-main-1 transition-all duration-200 ease-in-out"
                    ></div>
                </button>
                <div className="flex w-full flex-col gap-8">
                    <Link
                        className="mx-1 p-2 relative flex justify-center rounded-lg border-main-4 bg-main-2 active:scale-105 items-center group transition-all duration-200 ease-in-out"
                        to={"/"}>
                        <LeftArrowIcon className="w-[25px] h-[25px] z-20"/>
                        <div
                            className="w-full h-full absolute rounded-lg opacity-60 group-hover:bg-main-1 transition-all duration-200 ease-in-out"
                        ></div>
                    </Link>


                    <button
                        className="mx-1 p-2 relative flex justify-center rounded-lg border-main-4 bg-main-2  active:scale-105 items-center group transition-all duration-200 ease-in-out"
                        onClick={handleOpenBoardInfo}>
                        <SettingsIcon className="w-[25px] h-[25px]  z-20"/>
                        <div
                            className="w-full h-full absolute rounded-lg opacity-60 group-hover:bg-main-1 transition-all duration-200 ease-in-out"
                        ></div>
                    </button>

                </div>


            </motion.div>
            <motion.div className={`absolute w-full md:!hidden h-full z-30 bg-main-1 top-0`}
                        onClick={handleClose}
                        initial={{opacity: "0%"}}
                        animate={{opacity: "80%"}}
                        exit={{opacity: "0%"}}
                        transition={{ease: "linear", duration: 0.1}}>

            </motion.div>
        </>

    );
};

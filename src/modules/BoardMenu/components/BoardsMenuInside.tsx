import {FC, memo} from "react";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setClosed, setOpenBoardCreate} from "@store/slices/boardMenuSlice.ts";
import {ReactComponent as AddIcon} from "@assets/icons/AddIcon.svg";
import {ReactComponent as SettingsIcon} from "@assets/icons/SettingsIcon.svg";
import {Link} from "react-router-dom";
import {Close} from "@/ui/Close.tsx";
import {motion} from "framer-motion";

export const BoardsMenuInside: FC = memo(function () {
    const dispatch = useAppDispatch();
    const handleOpenBoardCreateMenu = () => {
        dispatch(setOpenBoardCreate());
        dispatch(setClosed());
    }
    const handleCloseBoardMenu = () => {
        dispatch(setClosed());
    };
    return (
        <div className="w-ful p-6 relative">
            <div className=" absolute right-0 top-0 mx-4 mt-4 cursor-pointer md:hidden">
                <Close onClick={handleCloseBoardMenu}/>
            </div>
            <div className="w-full h-full mt-12 md:mt-0 flex flex-col gap-4 justify-center">
                <motion.button
                    className="w-full flex gap-4 text-lg items-center text-main-4 relative cursor-pointer"
                    whileTap={{scale: 0.97, transition: {duration: 0.1}}}
                    whileHover={{scale: 1.03, transition: {duration: 0.1}}}
                    onClick={handleOpenBoardCreateMenu}>
                    <AddIcon className="w-[20px] h-[20px] ml-1"/>
                    <span className="h-full py-4">Add new board</span>
                    <motion.div
                        className="w-full h-full absolute bg-main-4 rounded-lg opacity-0" whileHover={{
                        opacity: "30%",
                        transition: {duration: 0.2}
                    }}
                    ></motion.div>
                </motion.button>
                <Link to="/" className="w-full text-main-4 relative">
                    <motion.div className="w-full h-full flex gap-4 text-lg items-center"
                                whileTap={{scale: 0.97, transition: {duration: 0.1}}}
                                whileHover={{scale: 1.03, transition: {duration: 0.1}}}><SettingsIcon
                        className="w-[20px] h-[20px] ml-1"/>
                        <span className="h-full py-4">Settings</span>
                        <motion.div
                            className="w-full h-full absolute bg-main-4 rounded-lg opacity-0" whileHover={{
                            opacity: "30%",
                            transition: {duration: 0.2}
                        }}
                        ></motion.div>
                    </motion.div>

                </Link></div>


        </div>
    )
})
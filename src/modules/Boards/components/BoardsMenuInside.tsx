import {FC, memo} from "react";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setMenuClosed, setOpenBoardCreate} from "@store/slices/boardMenuSlice.ts";
import {ReactComponent as AddIcon} from "@assets/icons/AddIcon.svg";
import {ReactComponent as SettingsIcon} from "@assets/icons/SettingsIcon.svg";
import {ReactComponent as LogoutIcon} from "@assets/icons/LogoutIcon.svg";
import {Link} from "react-router-dom";
import {Close} from "@/ui/Close.tsx";
import {motion} from "framer-motion";
import useSignOut from "@modules/Boards/hooks/useSignOut.ts";

export const BoardsMenuInside: FC = memo(function () {
    const dispatch = useAppDispatch();
    const {signOut} = useSignOut()
    const handleOpenBoardCreateMenu = () => {
        dispatch(setOpenBoardCreate());
        dispatch(setMenuClosed());
    }
    const handleCloseBoardMenu = () => {
        dispatch(setMenuClosed());
    };
    const handleSignOut=() =>{
        return signOut()
    }
    return (
        <div className="w-ful h-full p-6 relative flex flex-col">
            <div className="absolute right-0 top-0 mx-4 mt-4 cursor-pointer md:hidden">
                <Close onClick={handleCloseBoardMenu}/>
            </div>
            <div className="h-full w-full">
                <div className="w-full h-fit mt-12 md:mt-0 flex flex-col gap-4 justify-center">
                <motion.button
                    className="w-full flex gap-4 text-sm items-center text-main-4 relative cursor-pointer"
                    whileTap={{scale: 0.97, transition: {duration: 0.1}}}
                    whileHover={{scale: 1.03, transition: {duration: 0.1}}}
                    onClick={handleOpenBoardCreateMenu}>
                    <AddIcon className="w-[15px] h-[15px] ml-1"/>
                    <span className="h-full py-4">Add new board</span>
                    <motion.div
                        className="w-full h-full absolute bg-main-4 rounded-lg opacity-0" whileHover={{
                        opacity: "30%",
                        transition: {duration: 0.2}
                    }}
                    ></motion.div>
                </motion.button>
                <Link to="/" className="w-full text-main-4 relative">
                    <motion.div className="w-full h-full flex gap-4 text-sm items-center"
                                whileTap={{scale: 0.97, transition: {duration: 0.1}}}
                                whileHover={{scale: 1.03, transition: {duration: 0.1}}}><SettingsIcon
                        className="w-[15px] h-[15px] ml-1"/>
                        <span className="h-full py-4">Settings(WIP)</span>
                        <motion.div
                            className="w-full h-full absolute bg-main-4 rounded-lg opacity-0" whileHover={{
                            opacity: "30%",
                            transition: {duration: 0.2}
                        }}
                        ></motion.div>
                    </motion.div>

                </Link>
                </div>

            </div>

            <div className="w-full h-fit">
                <motion.button
                    className="w-full flex gap-4 text-sm items-center text-main-4 relative cursor-pointer"
                    whileTap={{scale: 0.97, transition: {duration: 0.1}}}
                    whileHover={{scale: 1.03, transition: {duration: 0.1}}}
                    onClick={handleSignOut}>
                    <LogoutIcon className="w-[15px] h-[15px] ml-1"/>
                    <span className="h-full py-4">Sign Out</span>
                    <motion.div
                        className="w-full h-full absolute bg-main-4 rounded-lg opacity-0" whileHover={{
                        opacity: "30%",
                        transition: {duration: 0.2}
                    }}
                    ></motion.div>
                </motion.button>
            </div>
        </div>
    )
})
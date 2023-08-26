import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setBoardInfo, setDeleteConfirmation, setStatus} from "@store/slices/boardMenuSlice.ts";
import {AnimatePresence, motion} from "framer-motion";
import {Close} from "@/ui/Close";
import {setOnline} from "@store/slices/networkSlice.ts";
import {FC, memo} from "react";
import {BoardType} from "types/BoardType.ts";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {useLocation, useOutletContext} from "react-router-dom";
import {Title} from "@modules/BoardInfo/components/Title.tsx";
import {time} from "@modules/Boards/helpers/time.ts";
import {ReactComponent as DeleteIcon} from "@assets/icons/DeleteIcon.svg";
import {StatusChange} from "@modules/BoardInfo/components/StatusChange.tsx";
import useClickOutside from "@hooks/useClickOutside.ts";
import {statusColor} from "@modules/Boards/helpers/statusColor.ts";
import {createPortal} from "react-dom";
import {DeleteConfirmation} from "@modules/BoardInfo/components/DeleteConfirmation.tsx";

type ContextType = { localBoard: BoardType };
export const BoardInfo: FC = memo(() => {
    const location = useLocation()
    const dispatch = useAppDispatch();
    const activeId = useAppSelector((state) => state.boardMenu.activeId);
    let board;
    if (!location.pathname.includes("board")) {
        const localBoards: BoardType[] = useOutletContext()
        board = localBoards.find((board) => board.id === activeId)
    } else {
        const {localBoard: temp} = useOutletContext<ContextType>()
        board = temp
    }


    const isStatusMenuOpened = useAppSelector((state) => state.boardMenu.statusChangeOpened);

    const isBoardDelConfOpened = useAppSelector((state) => state.boardMenu.openedDeleteConfirmation);
    const handleCloseBoardDelete = () => {
        dispatch(setOnline(true))
        dispatch(setBoardInfo(false));
    }
    const handleOpenBoardDeleteConfirmation = () => {
        dispatch(setOnline(true))
        dispatch(setDeleteConfirmation(true))
    }
    const handleStatusMenu = () => {
        dispatch(setOnline(true))
        dispatch(setStatus(!isStatusMenuOpened))
    }
    const handleCloseStatusMenu = () => {
        if (isStatusMenuOpened) {
            dispatch(setStatus(false))
        }

    }

    const ref = useClickOutside(handleCloseStatusMenu)
    return (

        <div
            className="top-0  bottom-0 w-screen h-screen flex justify-center items-center font-mono absolute z-50 overflow-hidden">
            <motion.div
                className="max-w-full overflow-y-scroll md:max-w-xl w-full h-full flex items-center  absolute flex-col bg-main-1  px-4 gap-5 sm:gap-6 z-50 top-0 select-none"
                initial={{right: "-101%"}}
                animate={{right: 0}}
                exit={{right: "-101%"}}>
                <div className="h-20 w-full flex justify-between items-center">

                    <Close onClick={handleCloseBoardDelete}/>
                    <span
                        className="flex justify-center items-center text-xl text-main-4 font-semibold ">Board Details</span>
                </div>


                <div className="w-full h-full flex flex-col gap-12 px-4 text-sm">
                    <div className="flex flex-col gap-2">
                        <span className="text-main-6 text-sm font-semibold">Board Title</span>
                        <Title title={board?.title} id={board?.id}/>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-main-6 text-sm font-semibold">Author</span>
                        <div className="text-main-4 text-sm">{board?.author}</div>
                    </div>


                    <div className="flex flex-col gap-2">
                        <span className="text-main-6 text-sm font-semibold">Status</span>
                        <div ref={ref} className="py-1 px-2 text-sm rounded-xl w-fit relative text-main-4"
                             style={{background: statusColor(board?.status)}}
                             onClick={handleStatusMenu}>{board?.status}
                            <AnimatePresence>  {isStatusMenuOpened && (
                                <StatusChange id={activeId}/>)}</AnimatePresence>

                        </div>

                    </div>
                    <div>
                        <div className="flex flex-col gap-2">
                            <span className="text-main-6 text-sm font-semibold">Last modified time</span>
                            <div className="text-main-4 text-sm">{time(board?.date).toLocaleString()}</div>
                        </div>
                    </div>

                </div>
                <div className="w-full pb-4 px-4">
                    <div
                        className="w-fit px-3 py-2 text-sm text-main-7 bg-main-2 rounded-xl flex flex-row gap-2 items-center active:scale-105 transition-all duration-100 ease-in-out"
                        onClick={handleOpenBoardDeleteConfirmation}>
                        <DeleteIcon className="w-6 h-6 "/>
                        Trash Board
                    </div>


                </div>
            </motion.div>
            <motion.div className={` w-screen h-screen absolute visible  bg-main-1  z-30 `}
                        onClick={handleCloseBoardDelete}
                        initial={{opacity: "0%"}}
                        animate={{opacity: "50%"}}
                        exit={{opacity: "0%"}}
                        transition={{ease: "linear", duration: 0.1}}>

            </motion.div>
            {
                createPortal(<AnimatePresence>{isBoardDelConfOpened &&
                    <DeleteConfirmation/>}</AnimatePresence>, document.body)
            }

        </div>
    );
});
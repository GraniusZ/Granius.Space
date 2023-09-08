import {FC, useEffect} from "react";
import {Board} from "@modules/Board";
import {createPortal} from "react-dom";
import {AnimatePresence} from "framer-motion";
import {BoardInfo} from "@modules/BoardInfo/components/BoardInfo.tsx";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {useLocation} from "react-router-dom";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setBoardInfo, setDeleteConfirmation, setStatus} from "@store/slices/boardMenuSlice.ts";
import {NetworkError} from "@modules/NetworkError";
import {setSideMenu} from "@store/slices/boardPageSlice.ts";
import {TaskInfo} from "@modules/TaskInfo/components/TaskInfo.tsx";

export const BoardPage: FC = () => {
    const isBoardInfoOpened = useAppSelector((state) => state.boardMenu.openedBoardInfo)
    const isTaskInfoOpened = useAppSelector((state) => state.boardPage.taskInfo)

    const location = useLocation();
    const dispatch = useAppDispatch();
    const isOnline = useAppSelector((state) => state.network.online);

    useEffect(() => {
        dispatch(setBoardInfo(false))
        dispatch(setDeleteConfirmation(false))
        dispatch(setStatus(false))
        dispatch(setSideMenu(false))
    }, [location, dispatch]);
    return (
        <div className="w-full h-full">
            <Board/>
            {
                createPortal(<AnimatePresence>{isBoardInfoOpened &&
                    <BoardInfo/>}</AnimatePresence>, document.body)
            }
            {
                createPortal(isTaskInfoOpened &&
                    <TaskInfo/>, document.body)
            }
            {
                createPortal(<AnimatePresence>{!isOnline &&
                    <NetworkError/>}</AnimatePresence>, document.body)
            }


        </div>

    );
};
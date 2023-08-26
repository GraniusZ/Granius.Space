import {FC, useEffect} from "react";
import {ProtectedRoute} from "@components/ProtectedRoute/ProtectedRoute.tsx";
import {usePageTitle} from "@hooks/usePageTitle";
import {Boards} from "src/modules/Boards";
import {createPortal} from "react-dom";
import {
    setCloseBoardCreate,
    setBoardInfo,
    setMenuClosed,
    setDeleteConfirmation,
    setStatus
} from "@store/slices/boardMenuSlice.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {AddNewBoard} from "@modules/Boards/components/AddNewBoard.tsx";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {NetworkError} from "@modules/NetworkError/components/NetworkError.tsx";
import {AnimatePresence} from "framer-motion";
import {useLocation} from "react-router-dom";
import {BoardInfo} from "@modules/BoardInfo/components/BoardInfo.tsx";

export const Home: FC = () => {
    const isBoardInfoOpened = useAppSelector((state) => state.boardMenu.openedBoardInfo)
    usePageTitle("Home");
    const dispatch = useAppDispatch();
    const location = useLocation();
    const isBoardCreateOpened = useAppSelector((state) => state.boardMenu.openedBoardCreate)
    const isOnline = useAppSelector((state) => state.network.online);
    useEffect(() => {
        dispatch(setCloseBoardCreate())
        dispatch(setMenuClosed())
        dispatch(setBoardInfo(false))
        dispatch(setDeleteConfirmation(false))
        dispatch(setStatus(false))
    }, [location, dispatch]);
    return (
        <div className="w-full h-full flex flex-col bg-main-1 relative">
            <ProtectedRoute>
                <div className="flex w-full h-full relative max-h-full">
                    <Boards/>
                </div>

                {
                    createPortal(<AnimatePresence>{isBoardCreateOpened &&
                        <AddNewBoard/>}</AnimatePresence>, document.body)
                }
                {
                    createPortal(<AnimatePresence>{isBoardInfoOpened &&
                        <BoardInfo/>}</AnimatePresence>, document.body)
                }
                {
                    createPortal(<AnimatePresence>{!isOnline &&
                        <NetworkError/>}</AnimatePresence>, document.body)
                }

            </ProtectedRoute>
        </div>
    );
};
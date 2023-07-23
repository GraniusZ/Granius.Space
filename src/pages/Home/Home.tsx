import {FC} from "react";
import {ProtectedRoute} from "@components/ProtectedRoute/ProtectedRoute.tsx";
import {usePageTitle} from "@hooks/usePageTitle";
import {Boards} from "@modules/BoardMenu";
import {createPortal} from "react-dom";

import {ReactComponent as LogoIcon} from "@assets/icons/Logo.svg";
import {Burger} from "@/ui/Burger.tsx";
import {changeOpened} from "@store/slices/boardMenuSlice.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {AddNewBoard} from "@modules/BoardMenu/components/AddNewBoard.tsx";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {DeleteBoard} from "@modules/BoardMenu/components/DeleteBoard.tsx";

export const Home: FC = () => {
    usePageTitle("Home");
    const dispatch = useAppDispatch();
    const handleChangeOpened = () => {
        dispatch(changeOpened());
    };
    const isBoardCreateOpened = useAppSelector((state) => state.boardMenu.openedBoardCreate)
    const isBoardDeleteOpened = useAppSelector((state) => state.boardMenu.openedDeleteBoard)
    return (
        <div className="w-full h-full flex flex-col bg-main-1 relative">
            <ProtectedRoute>
                <header
                    className="text-main-4 text-3xl flex flex-col w-full h-16 min-h-[64px] shadow-xl z-20 sticky noSelect">
                    <div className=" md:hidden visible top-0 bottom-0 h-fit my-auto left-1 absolute noSelect">
                        <Burger onClick={handleChangeOpened}/>
                    </div>
                    <div className="w-full h-full flex flex-row gap-4 items-center justify-center">
                        <LogoIcon
                            className="w-[30px] h-[30px]"/>
                        Kanban
                    </div>
                </header>
                <div className="flex w-full h-full relative max-h-full">
                    <Boards/>
                </div>
                {isBoardCreateOpened && createPortal(<AddNewBoard/>, document.body)}
                {
                    isBoardDeleteOpened &&  createPortal(<DeleteBoard/>, document.body)
                }
            </ProtectedRoute>
        </div>
    );
};
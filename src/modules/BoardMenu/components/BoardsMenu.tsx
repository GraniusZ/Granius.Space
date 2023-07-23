import {FC, memo} from "react";
import {BoardsMenuInside} from "@modules/BoardMenu/components/BoardsMenuInside.tsx";
import {createPortal} from "react-dom";
import {AnimatePresence} from "framer-motion";
import {BoardsMenuMobile} from "@modules/BoardMenu/components/BoardsMenuMobile.tsx";
import {useAppSelector} from "@hooks/useTypedSelector.ts";

export const BoardsMenu: FC = memo(function () {
        const burgerMenuOpened = useAppSelector(state => state.boardMenu.opened)
        return (
            <>
                <div
                    className="h-full w-full max-w-sm md:max-w-[350px] bg-main-3 drop-shadow-2xl mb-4 absolute  md:relative z-10 hidden md:block  md:left-0 md:visible "
                >
                    <BoardsMenuInside/>
                </div>

                {
                    createPortal(<AnimatePresence>{burgerMenuOpened &&
                        <BoardsMenuMobile/>}</AnimatePresence>, document.body)
                }
                <div className="absolute w-full ">
                    <div
                        className={`bg-main-2 w-full  visible md:hidden ${burgerMenuOpened ? "visible opacity-100" : "hidden opacity-0"}`}>

                    </div>
                </div>
            </>

        )
    }
)
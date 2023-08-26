import {FC} from "react";
import {Link} from "react-router-dom";
import {ReactComponent as AddIcon} from "@assets/icons/AddIcon.svg";
import {ReactComponent as LeftArrowIcon} from "@assets/icons/LeftArrowIcon.svg";
import {ReactComponent as SettingsIcon} from "@assets/icons/SettingsIcon.svg";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setBoardInfo} from "@store/slices/boardMenuSlice.ts";

export const SideMenu: FC = () => {
    const dispatch = useAppDispatch();
    const handleOpenBoardInfo = () => {
        dispatch(setBoardInfo(true))
    }
    return (
        <>
            <div className={`hidden md:flex top-0 bg-main-1 shadow-2xl h-full z-50 py-6 md:py-8 flex-col  gap-16 `}
            >
                <div className="flex w-full flex-col gap-8">
                    <Link
                        className="mx-3 p-2 relative flex justify-center rounded-lg border-main-4 bg-main-2 active:scale-105 items-center group transition-all duration-200 ease-in-out"
                        to={"/"}>
                        <LeftArrowIcon className="w-[25px] h-[25px] z-20"/>
                        <div
                            className="w-full h-full absolute rounded-lg opacity-60 group-hover:bg-main-1 transition-all duration-200 ease-in-out"
                        ></div>
                    </Link>
                    <button
                        className="mx-3 p-2 relative flex justify-center rounded-lg border-main-4 bg-main-2  active:scale-105 items-center group transition-all duration-200 ease-in-out">
                        <AddIcon className="w-[25px] h-[25px] z-20"/>
                        <div
                            className="w-full h-full absolute rounded-lg opacity-60 group-hover:bg-main-1 transition-all duration-200 ease-in-out"
                        ></div>
                    </button>

                    <button
                        className="mx-3 p-2 relative flex justify-center rounded-lg border-main-4 bg-main-2  active:scale-105 items-center group transition-all duration-200 ease-in-out"
                        onClick={handleOpenBoardInfo}>
                        <SettingsIcon className="w-[25px] h-[25px] z-20"/>
                        <div
                            className="w-full h-full absolute rounded-lg opacity-60 group-hover:bg-main-1 transition-all duration-200 ease-in-out"
                        ></div>
                    </button>

                </div>


            </div>
        </>
    );
};
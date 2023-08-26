import {FC, memo} from "react";
import {BoardType} from "types/BoardType.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {setSideMenu, setTitleInput} from "@store/slices/boardPageSlice.ts";
import {TitleChange} from "@modules/Board/components/TitleChange.tsx";
import useClickOutside from "@hooks/useClickOutside.ts";
import {ReactComponent as ThreeDots} from "@assets/icons/ThreeDotsIcon.svg";
type HeaderType = {
    data: BoardType | undefined
}

export const Header: FC<HeaderType> = memo(({data}) => {
    const dispatch = useAppDispatch()
    const isTitleChanging = useAppSelector(state => state.boardPage.titleChange)
    const handleClick = () => {
        dispatch(setTitleInput(true))
    }
    const handleClose = () =>{
        if (isTitleChanging === true){
            dispatch(setTitleInput(false))
        }

    }
    const handleOpenSideMenu = () =>{
        dispatch(setSideMenu(true))
    }
    const ref = useClickOutside(handleClose)
    return (
        <div className="flex w-full md:justify-normal justify-center items-center z-30">
            <div
                className={`w-full h-full p-3 shadow-xl z-10 py-2 bg-main-5 flex flex-row justify-center items-center gap-2 selectNone `}
                >
                <div className="flex md:hidden justify-center items-center group/dotsmenu relative p-1" onClick={handleOpenSideMenu}>
                    <ThreeDots className="w-[25px] h-[25px] z-10"/>
                    <div
                        className=" w-full h-full absolute  opacity-60 group-hover/dotsmenu:bg-main-1 transition-all duration-200 ease-in-out"
                    ></div>
                </div>
                <hr className="h-full md:hidden self-stretch inline-block w-[2px] bg-main-1 border-0 "/>

                <div className=" w-full text-sm md:text-base text-main-4 relative py-2 flex justify-center group items-center ! ellipsis whitespace-nowrap" ref={ref} onClick={handleClick}>

                    <span className="w-full h-full ellipsis z-10 px-1 md:px-2 "> {data?.title}</span>
					<div className="absolute w-full h-full bg-main-4 opacity-0 group-hover:opacity-30 transition-all duration-200 ease-in-out"></div>
                    {isTitleChanging && <TitleChange title={data?.title} id={data?.id}/>}
                </div>

            </div>
        </div>


    );
});
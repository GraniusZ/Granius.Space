import {FC, memo} from "react";
import {BoardsMenu} from "@modules/Boards/components/BoardsMenu.tsx";
import {useOutletContext} from "react-router-dom"
import {Table} from "@modules/Boards/components/Table.tsx";
import {Burger} from "@/ui/Burger";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {changeOpened} from "@store/slices/boardMenuSlice.ts";
import {BoardType} from "types/BoardType.ts";

export const Boards: FC = memo(function () {
    const localBoards: BoardType[] = useOutletContext()
    const dispatch = useAppDispatch();
    const handleChangeOpened = () => {
        dispatch(changeOpened());
    };

    return (
        <div className="flex flex-row w-full h-full relative box-border">
            <BoardsMenu/>
            <div className="w-full h-full max-h-full flex flex-col bg-main-1 relative z-[-50px]">
                <div className="h-fit text-xl text-main-4 font-semibold relative flex">
                    <div className=" md:hidden visible top-0 bottom-0 h-fit my-auto left-1 absolute noSelect">
                        <Burger onClick={handleChangeOpened}/>
                    </div>
                    <span className="px-4 py-2 h-full ml-[50px] md:ml-0 noSelect">Boards</span></div>
                <div
                    className="w-full h-full relative bg-main-2 overflow-scroll overflow-x-auto z-[-50px]">
                    {localBoards.length ? <Table boards={localBoards}/> :<div className="w-full h-full flex justify-center items-center text-xl md:text-2xl text-main-1 brightness-125 noSelect cursor-default">Create your first board</div> }

                </div>


            </div>

        </div>

    );
});

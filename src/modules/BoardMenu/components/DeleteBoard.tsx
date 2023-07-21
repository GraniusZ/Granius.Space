import {FC} from "react";
import {ReactComponent as CloseIcon} from "@assets/icons/CloseIcon.svg";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setCloseBoardDelete} from "@store/slices/boardMenuSlice.ts";
import useDeleteBoard from "@modules/BoardMenu/hooks/useDeleteBoard.ts";

export const DeleteBoard: FC = () => {
    const dispatch = useAppDispatch();
    const {handleDelete} = useDeleteBoard();
    const handleCloseBoardDelete = () =>{
        dispatch(setCloseBoardDelete());
    }

    return (
        <div
            className=" top-0 bottom-0 w-screen h-screen flex justify-center items-center font-mono absolute z-50 overflow-hidden">
            <div
                className="m-auto max-w-2xl w-full flex items-center justify-center flex-col bg-main-1 rounded-xl px-10 py-6 gap-2 sm:gap-3 z-50 mx-4 relative select-none">
                <div className=" absolute right-0 top-0 mx-3 mt-3 cursor-pointer" onClick={handleCloseBoardDelete} ><CloseIcon className="w-8 h-8"/></div>
                <label className="text-main-4 md:text-4xl mb-3 sm:mb-6 text-3xl text-center mx-5 mt-3">Are you sure that you want to delete the board?</label>
                <button className="w-full flex py-4 rounded-lg bg-main-2 max-h-14 justify-center items-center text-main-4 text-xl md:text-2xl cursor-pointer" onClick={handleDelete}>Delete the board</button>

            </div>
            <div className="w-screen h-screen absolute visible opacity-80 bg-main-1 z-0" onClick={handleCloseBoardDelete} ></div>
        </div>
    );
};
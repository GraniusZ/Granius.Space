import {FC} from "react";
import useDeleteBoard from "@modules/BoardInfo/hooks/useDeleteBoard.ts";
import {setOnline} from "@store/slices/networkSlice.ts";
import {setDeleteConfirmation} from "@store/slices/boardMenuSlice.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {Close} from "@/ui/Close";
import {motion} from "framer-motion";

export const DeleteConfirmation: FC = () => {
    const dispatch = useAppDispatch();
    const handleClose = () => {
        dispatch(setOnline(true))
        dispatch(setDeleteConfirmation(false));
    }

    const {handleDelete} = useDeleteBoard();
    return (
        <>
            <div
                className=" top-0 bottom-0 w-screen h-screen flex justify-center items-center font-mono absolute z-50 overflow-hidden">
                <div
                    className="m-auto max-w-sm w-full flex items-center justify-center flex-col bg-main-2 rounded-xl px-10 py-6 z-50 mx-4 relative select-none">
                    <div className=" absolute right-0 top-0 mx-3 mt-3 cursor-pointer">
                        <Close onClick={handleClose}/></div>
                    <label className="text-main-6 md:text-lg mb-3 sm:mb-6 text-base text-center mx-5 mt-3">Are you sure
                        that you want to delete the board?</label>
                    <button
                        className="w-full flex py-4 rounded-lg bg-main-3 max-h-14 justify-center items-center text-main-7 text-sm md:text-base cursor-pointer"
                        onClick={handleDelete}>Delete the board
                    </button>

                </div>
                <motion.div className={` w-screen h-screen absolute visible  bg-main-1  z-30 `}
                            onClick={handleClose}
                            initial={{opacity: "0%"}}
                            animate={{opacity: "50%"}}
                            exit={{opacity: "0%"}}
                            transition={{ease: "linear", duration: 0.1}}>

                </motion.div>
            </div>
        </>
    );
};
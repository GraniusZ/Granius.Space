import {FC, useState} from "react";
import {useForm} from "react-hook-form";
import {setCloseBoardCreate, setStatus} from "@store/slices/boardMenuSlice.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";

import useCreateBoard from "@modules/Boards/hooks/useCreateBoard.ts";
import {AnimatePresence, motion} from "framer-motion";
import {Close} from "@/ui/Close.tsx";
import {setOnline} from "@store/slices/networkSlice.ts";
import {BoardType} from "types/BoardType.ts";
import useClickOutside from "@hooks/useClickOutside.ts";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {AddBoardStatusMenu} from "@modules/Boards/components/AddBoardStatusMenu.tsx";
import {StatusType} from "types/StatusType.ts";

export const AddNewBoard: FC = () => {
    const isStatusMenuOpened = useAppSelector((state) => state.boardMenu.statusChangeOpened);

    const [addBoardStatus, setAddBoardStatus] = useState<StatusType>({status: "Active", color: "#52AA8A"})
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<BoardType>({
        mode: "onChange",
    });
    const handleCloseStatusMenu = () => {
        if (isStatusMenuOpened) {
            dispatch(setStatus(false))
        }

    }
    const handleStatusMenu = () => {
        dispatch(setOnline(true))
        dispatch(setStatus(!isStatusMenuOpened))
    }
    const ref = useClickOutside(handleCloseStatusMenu)

    const dispatch = useAppDispatch();
    const handleCloseBoardCreateMenu = () => {
        dispatch(setOnline(true))
        dispatch(setCloseBoardCreate());
    }
    const {handleAdd} = useCreateBoard();
    const submit = (data: BoardType) => handleAdd({...data, status: addBoardStatus.status})

    return (
        <div
            className=" top-0 bottom-0 w-screen h-screen flex justify-center items-center font-mono absolute z-50 overflow-hidden">
            <form
                className="m-auto max-w-lg w-full flex items-center justify-center flex-col bg-main-1 rounded-xl px-8 py-5 gap-2 sm:gap-4 z-50 mx-4 relative select-none"
                onSubmit={handleSubmit(submit)}>
                <div className=" absolute right-0 top-0 mx-3 mt-3 cursor-pointer">
                    <Close onClick={handleCloseBoardCreateMenu}/></div>

                <label className="text-main-4  mb-3 sm:mb-6 text-xl mx-8 md:mx-0 text-center ">Add new board</label>
                <div className="w-full mb-4 flex-col ">
                    <input
                        className={`mb-1 bg-main-2 w-full text-main-4 text-base px-5 py-3 rounded-lg placeholder:text-main-4 box-border border ${errors.title ? 'border-red-500' : ''} select-none `}
                        placeholder={"Title"}
                        type={"text"}
                        {...register("title", {
                            required: {
                                value: true,
                                message: "Please enter your title",
                            },

                        })}
                    />
                    {errors.title && (
                        <span className="text-main-3 text-xs md:text-sm">{errors.title.message}</span>
                    )}
                    <div className="flex flex-col gap-2 mt-4">
                        <span className="text-main-4 text-sm ">Status</span>
                        <div  ref={ref}
                              className="py-1 px-2 text-sm rounded-xl w-fit relative text-main-4 "
                              style={{background: addBoardStatus.color}} onClick={handleStatusMenu}
                        >{addBoardStatus.status}
                            <AnimatePresence> {isStatusMenuOpened && (
                              <AddBoardStatusMenu setStatus={setAddBoardStatus}/>
                                )}</AnimatePresence></div>
                    </div>

                </div>

                <button type={"submit"}
                        className="w-full flex py-4  rounded-lg bg-main-2 max-h-14 justify-center items-center">
                    <div className="w-full h-full">
                        <div
                            className="w-full h-full justify-center items-center gap-3 flex text-main-4 text-lg py-1 ">
                            <span>Submit</span>
                        </div>
                    </div>
                </button>

            </form>

            <motion.div className={` w-screen h-screen absolute visible  bg-main-1  z-30 `}
                        onClick={handleCloseBoardCreateMenu}
                        initial={{opacity: "0%"}}
                        animate={{opacity: "50%"}}
                        exit={{opacity: "0%"}}
                        transition={{ease: "linear", duration: 0.1}}>

            </motion.div>
        </div>
    );
};

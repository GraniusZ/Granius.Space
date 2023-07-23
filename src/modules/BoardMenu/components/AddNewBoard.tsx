import {FC} from "react";
import {useForm} from "react-hook-form";

import {AddNewBoardFormType} from "types/AddNewBoardFormType.ts";
import {setCloseBoardCreate} from "@store/slices/boardMenuSlice.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";

import useCreateBoard from "@modules/BoardMenu/hooks/useCreateBoard.ts";
import {motion} from "framer-motion";
import {Close} from "@/ui/Close.tsx";

export const AddNewBoard: FC = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<AddNewBoardFormType>({
        mode: "onChange",
    });
    const dispatch = useAppDispatch();
    const handleCloseBoardCreateMenu = () => {
        dispatch(setCloseBoardCreate());
    }
    const {handleAdd} = useCreateBoard();
    return (
        <div
            className=" top-0 bottom-0 w-screen h-screen flex justify-center items-center font-mono absolute z-50 overflow-hidden">

            <form
                className="m-auto max-w-2xl w-full flex items-center justify-center flex-col bg-main-1 rounded-xl px-8 py-5 gap-2 sm:gap-4 z-50 mx-4 relative select-none"
                onSubmit={handleSubmit(handleAdd)}>
                <div className=" absolute right-0 top-0 mx-3 mt-3 cursor-pointer">
                    <Close onClick={handleCloseBoardCreateMenu}/></div>

                <label className="text-main-4 md:text-5xl mb-3 sm:mb-6 text-3xl mx-8 md:mx-0 text-center">Add new board</label>
                <div className="w-full mb-4 gap-3 flex-col">
                    <input
                        className={`mb-1 bg-main-2 w-full text-main-4 text-xl md:text-2xl px-5 py-3 rounded-lg placeholder:text-main-4 box-border border ${errors.title ? 'border-red-500' : ''} select-none `}
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
                        <span className="text-main-3 text-sm md:text-xl">{errors.title.message}</span>
                    )}
                </div>
                <div className="w-full mb-4 gap-3 flex-col">
                    <input
                        className={`mb-1 bg-main-2 w-full text-main-4 text-xl md:text-2xl px-5 py-3 rounded-lg placeholder:text-main-4 box-border border  select-none`}
                        placeholder={"Description"}
                        type={"text"}
                        {...register("description",
                        )}
                    />
                </div>
                <button type={"submit"}
                        className="w-full flex py-4 rounded-lg bg-main-2 max-h-14 justify-center items-center">
                    <div className="w-full h-full">
                        <div
                            className="w-full h-full justify-center items-center gap-3 flex text-main-4 text-xl md:text-2xl py-1 ">
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
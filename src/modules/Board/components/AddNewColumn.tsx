import {FC, useEffect} from "react";
import {useForm} from "react-hook-form";
import {ReactComponent as SubmitIcon} from "@assets/icons/SubmitIcon.svg";
import {motion} from "framer-motion";
import {useAddColumn} from "@modules/Board/hooks/useAddColumn.ts";
import {ColumnType} from "types/ColumnType.ts";


export const AddNewColumn: FC = () => {
    const {handleAdd} = useAddColumn();
    const {register, handleSubmit, setFocus, resetField} = useForm<ColumnType>({
        mode: "onChange",

    })
    const submit = (data: ColumnType) => {
        resetField("title")
        setFocus("title");

        return handleAdd(data)


    };

    useEffect(() => {
        setFocus("title")
    }, [setFocus, handleAdd])
    return (
        <div className="h-fit top-0 left-0 p-inherit w-full  absolute box-border z-10 flex items-center flex-col gap-2"
             onSubmit={handleSubmit(submit)}>
            <form className="w-full items-center flex flex-row relative mx-6  box-border gap-3">
                <input
                    className={`bg-main-2 placeholder:text-lg   w-full text-lg font-semibold placeholder:text-main-3  md:text-base z-30 text-main-7  box-border  outline-0`}
                    placeholder={"Add New Column"}

                    {...register("title", {
                        required: {
                            value: true,
                            message: "Your title must have at least one letter",
                        },

                    })}

                />
                <button
                    className="h-full group/title border-main-7 justify-center items-center rounded-br-lg rounded-tr-lg relative flex md:hidden">
                    <SubmitIcon className="w-[25px] h-[25px] z-20"/>
                    <div
                        className="absolute w-full h-full rounded-full  group-hover/title:bg-main-7 group-hover/title:border-1 group-hover/title:border-main-4 transition-all duration-200 ease-in-out"></div>
                </button>

            </form>
            <motion.hr className=" self-stretch inline-block w-full h-[2px] bg-main-7 border-0 "
                       initial={{width: 0}} animate={{width: "100%"}}
                       exit={{width: 0}}
                       transition={{ease: "linear", duration: 0.3}}/>

        </div>
    );
}
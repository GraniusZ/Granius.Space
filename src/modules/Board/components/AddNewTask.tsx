import {FC, useEffect} from "react";
import {useForm} from "react-hook-form";


import {useAddTask} from "@modules/Board/hooks/useAddTask.ts";
import {ColumnType} from "types/ColumnType.ts";
import {TaskType} from "types/TaskType.ts";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {setActiveColumn, setAddTask} from "@store/slices/boardPageSlice.ts";
import useClickOutside from "@hooks/useClickOutside.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";

type AddNewTask = {
    tasks: TaskType[],
    columnId: string
}
export const AddNewTask: FC<AddNewTask> = ({tasks, columnId}) => {
    const {handleAdd} = useAddTask();
    const {register, handleSubmit, setFocus, resetField} = useForm<ColumnType>({
        mode: "onChange",

    })
    const activeColumn = useAppSelector((state) => state.boardPage.activeColumn);
    const submit = (data: TaskType) => {
        resetField("title")
        return handleAdd(data, tasks)


    };
    const dispatch = useAppDispatch()
    const handleCloseAddTask = () => {
        dispatch(setAddTask(false))
        dispatch(setActiveColumn({}))

    }

    useEffect(() => {
        setFocus("title")
    }, [setFocus, handleAdd])
    const ref = useClickOutside(handleCloseAddTask);

    return (
        (activeColumn.id === columnId) && (
            <div className="w-full text-sm h-fit z-10 bg-main-1 flex items-center flex-col gap-2 " ref={ref}>
                <form className="w-full items-center bg-main-1 justify-start flex flex-col relative mx-6  h-fit box-border gap-3" onSubmit={handleSubmit(submit)}>
                    <input
                        autoFocus
                        {...register("title", {
                            required: {
                                value: true,
                                message: "Your title must have at least one letter",
                            },

                        })}

                        className={` overflow-hidden resize-none outline-0 h-fit w-full  rounded-sm bg-main-3  p-4 px-3 pr-10 z-10 shadow-xl group/task noSelect cursor-pointer border-main-7 border text-sm placeholder:text-main-2 text-main-1 font-bold break-words noSelect brightness-125`}
                        placeholder={"Enter your task "}


                    />
                    <div className="w-full h-fit bg-main-1">
                        <button
                            type="submit"
                            className="h-full group/title border-main-7 w-fit  items-center rounded-br-lg rounded-tr-lg relative flex"
                        >
                            <span className="w-full h-full py-1 px-3 z-50 text-main-3 font-semibold group-hover/title:brightness-50  transition-all duration-200 ease-in-out"> Add New Task</span>

                            <div
                                className="absolute w-full h-full rounded-lg  group-hover/title:bg-main-6 group-hover/title:border-1 group-hover/title:border-main-4 transition-all duration-200 ease-in-out"></div>
                        </button>
                    </div>
                </form>
            </div>
        )
    );
};
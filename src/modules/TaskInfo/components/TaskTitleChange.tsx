import {FC, KeyboardEvent, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setTitleTaskChange} from "@store/slices/boardPageSlice.ts";
import {setOnline} from "@store/slices/networkSlice.ts";
import useClickOutside from "@hooks/useClickOutside.ts";
import {useOutletContext} from "react-router-dom";
import {ColumnType} from "types/ColumnType.ts";
import {TaskType} from "types/TaskType.ts";
import {useChangeTaskTitleMutation} from "@/api/boardApi.ts";
import {TasksListType} from "types/TasksListType.ts";
import TextareaAutosize from 'react-textarea-autosize';
type TitleChangeType = {
    title: string | undefined
    task: TaskType | undefined
}
type TitleForm = {
    title: string,

}
type ContextType = { localTasksList: TasksListType[], localColumns:ColumnType };

export const TaskTitleChange: FC<TitleChangeType> = ({title, task}) => {
    const dispatch = useAppDispatch()
    const [changeTitle] = useChangeTaskTitleMutation();
    const {localTasksList: list, localColumns:columns} = useOutletContext<ContextType>()
    const activeId = useAppSelector((state) => state.boardMenu.activeId);

    const user = useAppSelector((state) => state.user.user);
    const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);
    const {register, handleSubmit, setFocus,} = useForm<TitleForm>({
        mode: "onChange",
        defaultValues: {
            title: title
        }
    })
    const columnId = list.find(column => column.tasks.some(columnTask => task?.id === columnTask.id))?.id

    const handleCloseChangeTitle = () => {
        dispatch(setTitleTaskChange(false))
    }
    useEffect(() => {
        setFocus("title")
    }, [setFocus])
    const submit = async (data: TitleForm) => {
        if (deleteTimer) {
            clearTimeout(deleteTimer);
        }
        if (!navigator.onLine) {
            dispatch(setOnline(false))
            const newTimer = setTimeout(() => dispatch(setOnline(true)), 3000);
            setDeleteTimer(newTimer);
            return;
        }
        await changeTitle({newTitle: data.title, userId: user.uid, boardId: activeId, columns: columns, taskId: task?.id, columnId:columnId })

    }
    const submitOnEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(submit)();
        }
    };
    const ref = useClickOutside(handleCloseChangeTitle)
    return (
        <div className="w-full h-fit  font-semibold pr-10"  >
            <div ref={ref}>
                <form className="w-full h-full flex bg-main-3 flex-row  z-20 "
                      onSubmit={handleSubmit(submit)}>

                    <TextareaAutosize
                        className={`text-sm resize-none bg-main-1 w-full text-main-7  !font-semibold   z-30 placeholder:text-main-4 box-border outline-0 `}
                        {...register("title", {
                            required: {
                                value: true,
                                message: "Your title must have at least one letter",
                            },

                        })}
                        onKeyDown={submitOnEnter}
                    />


                </form>
            </div>

        </div>

    );
};
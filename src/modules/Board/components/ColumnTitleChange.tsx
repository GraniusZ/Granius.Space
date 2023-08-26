import {FC, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {ReactComponent as SubmitIcon} from "@assets/icons/SubmitIcon.svg";
import {useChangeTitleColumnMutation} from "@/api/boardApi.ts";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setActiveColumn, setColumnTitleInput} from "@store/slices/boardPageSlice.ts";
import {setOnline} from "@store/slices/networkSlice.ts";
import useClickOutside from "@hooks/useClickOutside.ts";

type TitleChangeType = {
    title: string | undefined
}
type TitleForm = {
    title: string,

}
export const ColumnTitleChange: FC<TitleChangeType> = ({title}) => {
    const dispatch = useAppDispatch()
    const [changeTitle] = useChangeTitleColumnMutation()
    const user = useAppSelector((state) => state.user.user);
    const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);
    const {register, handleSubmit, setFocus,} = useForm<TitleForm>({
        mode: "onChange",
        defaultValues: {
            title: title
        }
    })
    const handleCloseChangeTitle = () => {
        dispatch(setColumnTitleInput(false))
        dispatch(setActiveColumn({}))
    }
    const activeColumn = useAppSelector((state) => state.boardPage.activeColumn);
    const activeId = useAppSelector((state) => state.boardMenu.activeId);
    useEffect(() => {
        setFocus("title")
    }, [setFocus])
    const handleClick = async (data: TitleForm) => {
        if (deleteTimer) {
            clearTimeout(deleteTimer);
        }
        if (!navigator.onLine) {
            dispatch(setOnline(false))
            const newTimer = setTimeout(() => dispatch(setOnline(true)), 3000);
            setDeleteTimer(newTimer);
            return;
        }
        await Promise.all([dispatch(setColumnTitleInput(false)),
            dispatch(setActiveColumn({})), changeTitle({newTitle: data.title, userId: user.uid, boardId: activeId, columnId: activeColumn.id})])
    }
    const ref = useClickOutside(handleCloseChangeTitle)
    return (
        <div className="w-full h-fit  font-semibold " ref={ref}>
            <form className="w-full h-full flex bg-main-1 flex-row  z-20"
                  onSubmit={handleSubmit(handleClick)}>

                <input
                    className={`pl-4 bg-main-1 w-full text-main-7 md:text-base !text-lg !font-semibold pr-1  z-30 placeholder:text-main-4 box-border outline-0 `}
                    {...register("title", {
                        required: {
                            value: true,
                            message: "Your title must have at least one letter",
                        },

                    })}
                />

                <button
                    className="h-full group/title border-main-7 justify-center items-center rounded-br-lg rounded-tr-lg relative flex md:hidden"
                    type={"submit"}>

                    <SubmitIcon className="w-[25px] h-[25px] z-20 fill-main-7"/>
                    <div
                        className="absolute w-full h-full rounded-full  group-hover/title:bg-main-6 group-hover/title:border-1 group-hover/title:border-main-4 transition-all duration-200 ease-in-out"></div>
                </button>

            </form>
        </div>

    );
};
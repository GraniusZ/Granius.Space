import {FC, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {ReactComponent as SubmitIcon} from "@assets/icons/SubmitIcon.svg";
import {useChangeTitleMutation} from "@/api/boardApi.ts";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setTitleInput} from "@store/slices/boardPageSlice.ts";
import {setOnline} from "@store/slices/networkSlice.ts";

type TitleChangeType = {
    title: string | undefined
    id: string | undefined
}
type TitleForm = {
    title: string,

}
export const TitleChange: FC<TitleChangeType> = ({title, id}) => {
    const dispatch = useAppDispatch()
    const [changeTitle] = useChangeTitleMutation()
    const user = useAppSelector((state) => state.user.user);
    const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>( null);
    const {register, handleSubmit, setFocus,} = useForm<TitleForm>({
        mode: "onChange",
        defaultValues: {
            title: title
        }
    })
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
        await Promise.all([dispatch(setTitleInput(false)),changeTitle({newTitle: data.title, userId: user.uid, boardId: id})])
    }
    return (
        <form className="w-full h-full flex bg-main-2 flex-row  border border-main-7 absolute z-20"
              onSubmit={handleSubmit(handleClick)}>

            <input
                className={`bg-main-2  w-full text-main-4 text-sm md:text-base px-1 md:px-2 py-3  z-30 placeholder:text-main-4 box-border outline-0 `}
                {...register("title", {
                    required: {
                        value: true,
                        message: "Your title must have at least one letter",
                    },

                })}
            />

            <button
                className="p-2 group/title bg-main-1 h-full  justify-center items-center  relative flex md:hidden">
                <SubmitIcon className={"w-[25px] h-[25px] z-20"}/>
                <div
                    className="absolute w-full h-full bg-main-1  group-hover/title:bg-main-7  transition-all duration-200 ease-in-out"></div>
            </button>

        </form>
    );
};
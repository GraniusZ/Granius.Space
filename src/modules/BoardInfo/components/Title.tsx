import {FC, useState} from "react";
import {useForm} from "react-hook-form";
import {ReactComponent as SubmitIcon} from "@assets/icons/SubmitIcon.svg";
import {useChangeTitleMutation} from "@/api/boardApi";
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
export const Title: FC<TitleChangeType> = ({title, id}) => {
    const dispatch = useAppDispatch()
    const [changeTitle] = useChangeTitleMutation()
    const user = useAppSelector((state) => state.user.user);
    const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>( null);

    const {register, handleSubmit,} = useForm<TitleForm>({
        mode: "onChange",
        defaultValues: {
            title: title
        }
    })
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
        await Promise.all([dispatch(setTitleInput(false)), changeTitle({newTitle: data.title, userId: user.uid, boardId: id})])
    }
    return (
        <form className="w-full h-fit flex bg-main-2 z-20 flex-row rounded-lg border border-main-7"
              onSubmit={handleSubmit(handleClick)}>

            <input
                className={`bg-main-2 w-full text-main-4 text-sm md:text-base px-5 py-3 rounded-bl-lg rounded-tl-lg md:rounded-lg z-30 placeholder:text-main-4 box-border  `}
                {...register("title", {
                    required: {
                        value: true,
                        message: "Your title must have at least one letter",
                    },

                })}
            />

            <button
                className="p-2 group/title h-[44px] w-[44px] bg-main-1 border-main-7 justify-center items-center rounded-br-lg rounded-tr-lg relative flex md:hidden">
                <SubmitIcon className={"w-[35px] h-[35px] z-20"}/>
                <div
                    className="absolute w-full h-full bg-main-1 rounded-br-lg rounded-tr-lg  group-hover/title:bg-main-7 group-hover/title:border-1 group-hover/title:border-main-4 transition-all duration-200 ease-in-out"></div>
            </button>

        </form>
    );
};
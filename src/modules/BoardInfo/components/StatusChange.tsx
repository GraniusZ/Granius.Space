import {FC, useState} from "react";
import {statuses} from "@/const/statuses";
import {motion} from "framer-motion";
import {useChangeStatusMutation} from "@/api/boardApi";
import {setOnline} from "@store/slices/networkSlice.ts";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";

type StatusChange = {
    id: string
}
export const StatusChange: FC<StatusChange> = ({id}) => {
    const [handleChange] = useChangeStatusMutation()
    const dispatch = useAppDispatch()

    const user = useAppSelector((state) => state.user.user);
    const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);
    const handleClick = async (status: string) => {
        if (deleteTimer) {
            clearTimeout(deleteTimer);
        }
        if (!navigator.onLine) {
            dispatch(setOnline(false))
            const newTimer = setTimeout(() => dispatch(setOnline(true)), 3000);
            setDeleteTimer(newTimer);
            return;
        }
        await handleChange({newStatus: status, userId: user.uid, boardId: id})
    }
    return (

        <motion.div
            className="absolute mt-2 h-fit w-fit max-h-44 overflow-y-scroll bg-main-1 brightness-150 z-20 rounded-lg shadow-xl flex flex-col  !whitespace-nowrap"
            initial={{scaleX: 0.9, scaleY: 0.9}} animate={{scaleX: 1, scaleY: 1}} exit={{scaleX: 0.9, scaleY: 0.9}}
            transition={{ease: "linear", duration: 0.05}}>
            {statuses.map((status, index) => (
                <div key={index} className="flex flex-row gap-4 items-center w-full hover:bg-main-2 px-6 z-10 py-2"
                     onClick={() => handleClick(status.status)}>
                    <div style={{background: status.color}} className="h-4 w-4 rounded-full"></div>
                    <div className="mr-24 text-main-4">{status.status}</div>
                </div>

            ))}
        </motion.div>
    );
};
import {FC, memo, useEffect, useState} from "react";
import {Outlet, useParams} from "react-router-dom";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {useGetBoardQuery, useGetColumnsQuery, useGetTasksListQuery} from "@/api/boardApi.ts";
import {BoardNotFound} from "@modules/Board/components/BoardNotFound.tsx";


export const BoardLayout: FC = memo(() => {
    const [isLoadingComplete, setLoadingComplete] = useState(false);

    const user = useAppSelector((state) => state.user.user);
    const {id} = useParams();
    const {data: board, isError, isLoading} = useGetBoardQuery({userId: user?.uid, boardId: id}, {skip: !user.uid || !id})
    const {data: columns, isLoading: isLoadingColumns} = useGetColumnsQuery({userId: user?.uid, boardId: id, }, {skip: !user.uid || !id})
    const localColumns = columns || [];
    const localBoard = board || {};
    const {data:tasksList, isLoading:isLoadingTasks} = useGetTasksListQuery({userId: user?.uid, boardId: id, columns:columns}, {skip: !columns || !user.uid || !id})
    const localTasksList = tasksList || []


    useEffect(() => {

        if ((!isLoading && !isLoadingColumns) && !isLoadingTasks) {
            setLoadingComplete(true);
        }
    }, [isLoading, isLoadingColumns, isLoadingTasks,]);
    if (isError || !user) {
        return (<BoardNotFound/>)
    }
    if (user) {
        if (!isLoadingComplete) {
            return (
                <div className="w-full h-full bg-main-2 flex items-center animate-gradient-xy justify-center">
                    <div
                        className="w-full h-full justify-center items-center flex text-center text-xl font-bold text-main-7">
                        Your board is loading...
                    </div>
                </div>
            );
        }
    }


    return (
        <div className="w-full h-full bg-main-2 flex items-center animate-gradient-xy justify-center">
            <Outlet context={{localBoard, localColumns, localTasksList}}/>
        </div>
    );
});

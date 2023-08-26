import {FC, memo, useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {BigSpinner} from "@/ui/BigSpinner";
import {useGetBoardsQuery} from "@/api/boardsApi.ts";
import {useAppSelector} from "@hooks/useTypedSelector.ts";

type LayoutProps = {
    loading?: boolean;
};

export const BoardsLayout: FC<LayoutProps> = memo(() => {
    const user = useAppSelector((state) => state.user.user);
    const {data, isLoading} = useGetBoardsQuery(user ? user.uid : "", {skip: !user});

    const [isLoadingComplete, setLoadingComplete] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setLoadingComplete(true);
        }
    }, [isLoading]);
	if (user){
        if ( !isLoadingComplete) {
            return (
                <div className="w-full h-full bg-main-2 flex items-center animate-gradient-xy justify-center">
                    <div className="w-full h-full justify-center items-center flex text-center">
                        <BigSpinner/>
                    </div>
                </div>
            );
        }
    }

    const boards = data || [];
    return (
        <div className="w-full h-full bg-main-2 flex items-center animate-gradient-xy justify-center">
            <Outlet context={boards}/>
        </div>
    );
});
import {FC} from "react";
import {Outlet} from "react-router-dom"
import {BigSpinner} from "@/ui/BigSpinner";

type LayoutProps = {
    loading?: boolean;
};

export const Layout: FC<LayoutProps> = ({loading}) => {
    return (
        <div
            className="w-screen h-screen bg-gradient-to-br from-main-1 via-main-2 to-main-3 flex items-center animate-gradient-xy justify-center">
            {loading ? (<div className="w-full h-full justify-center items-center flex text-center"><BigSpinner/>
            </div>) : <Outlet/>}
        </div>
    );
};
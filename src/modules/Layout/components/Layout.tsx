import {FC, memo} from "react";
import {Outlet} from "react-router-dom";

type LayoutProps = {
    loading?: boolean;
};

export const Layout: FC<LayoutProps> = memo(() => {


    return (
        <div className="w-full h-full bg-main-2 flex items-center animate-gradient-xy justify-center">
            <Outlet/>
        </div>
    );
});
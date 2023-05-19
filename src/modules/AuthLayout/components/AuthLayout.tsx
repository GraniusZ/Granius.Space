import {FC} from "react";
import {Outlet} from "react-router-dom"
export const AuthLayout: FC = () => {
    return (
        <div className="w-full h-full bg-gradient-to-br from-1 via-2 to-3 flex items-center">
            <Outlet/>
        </div>
    );
};
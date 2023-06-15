import {FC} from "react";
import {ProtectedRoute} from "@components/ProtectedRoute/ProtectedRoute.tsx";
import {usePageTitle} from "@hooks/usePageTitle";
import {Board} from "@modules/Board";


export const Home: FC = () => {
    usePageTitle("Home");
    return (
        <div className="w-full h-full p-5">
            <ProtectedRoute>
                <Board/>
            </ProtectedRoute>
        </div>
    );
};
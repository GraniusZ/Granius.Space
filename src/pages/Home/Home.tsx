import {FC} from "react";
import {ProtectedRoute} from "@components/ProtectedRoute/ProtectedRoute.tsx";
import {usePageTitle} from "@hooks/usePageTitle";
import {Board} from "@modules/Board";


export const Home: FC = () => {
    usePageTitle("Home");
    return (
        <>
            <ProtectedRoute>
                <Board/>
            </ProtectedRoute>
        </>
    );
};
import {FC} from "react";
import {ProtectedRoute} from "@components/ProtectedRoute/ProtectedRoute.tsx";
import {usePageTitle} from "@hooks/usePageTitle";


export const Home: FC = () => {
    usePageTitle("Home");
    return (
        <>
            <ProtectedRoute>
                <div></div>
            </ProtectedRoute>
        </>
    );
};
import {FC, ReactElement, ReactNode} from "react";
import {Navigate} from "react-router-dom";
import {useIsAuth} from "@hooks/useIsAuth.ts";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({children}: ProtectedRouteProps): ReactElement => {

    const isLogged: boolean = useIsAuth()


    if (!isLogged) {
        return <Navigate to="/login"/>;
    }

    return <>{children}</>;
};
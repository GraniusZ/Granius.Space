import {FC, ReactElement, ReactNode} from "react";
import {useIsAuth} from "@hooks/useIsAuth.ts";
import {Navigate} from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({children}: ProtectedRouteProps): ReactElement => {
    const isAuth: boolean = useIsAuth();

    if (!isAuth) {
        return <Navigate to="/login"/>;
    }

    return <>{children}</>;
};
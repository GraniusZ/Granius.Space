import {FC} from "react";
import {usePageTitle} from "@hooks/usePageTitle.ts";
import {LoginForm} from "@modules/LoginForm";
import {AuthWarning} from "src/modules/AuthWarning";
import {useIsAuth} from "@hooks/useIsAuth.ts";

export const Login: FC = () => {
    const isAuth = useIsAuth();
    usePageTitle("Login");
    if (document.referrer === "" && isAuth) {
        return <AuthWarning/>;
    }
    return (
        <LoginForm/>
    );
};
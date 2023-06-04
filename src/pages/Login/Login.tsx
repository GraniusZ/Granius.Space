import {FC} from "react";
import {usePageTitle} from "@hooks/usePageTitle.ts";
import {LoginForm} from "@modules/LoginForm";
import {AuthWarning} from "src/modules/AuthWarning";
import {useIsAuth} from "@hooks/useIsAuth.ts";
import {useState} from "react";

export const Login: FC = () => {
    const isAuth = useIsAuth();
    const [state] = useState(isAuth);
    usePageTitle("Login");


    return (
        <>
            {state ? <AuthWarning/> :<LoginForm/> }
        </>
    );
};
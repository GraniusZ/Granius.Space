import {FC} from "react";
import {usePageTitle} from "@hooks/usePageTitle.ts";
import {LoginForm} from "@modules/LoginForm";

export const Login: FC = () => {
    usePageTitle("Login");
    return (
        <>
            <LoginForm/>
        </>
    );
};
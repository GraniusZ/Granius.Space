import {FC, useState} from "react";
import {usePageTitle} from "@hooks/usePageTitle.ts";
import {useIsAuth} from "@hooks/useIsAuth.ts";
import {AuthWarning} from "@modules/AuthWarning";
import {RegisterForm} from "@modules/RegisterForm";

export const Register: FC = () => {
    const isAuth = useIsAuth();
    const [state] = useState(isAuth);
    usePageTitle("Register");
    return (
        <>
            {state ? <AuthWarning/> :<RegisterForm/> }
        </>
    );
};
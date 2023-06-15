import {FC} from "react";
import {NotFoundLabel} from "@modules/NotFoundLabel";
import {usePageTitle} from "@hooks/usePageTitle.ts";

export const NotFound: FC = () => {
    usePageTitle("Not Found");
    return (
        <NotFoundLabel/>
    );
};
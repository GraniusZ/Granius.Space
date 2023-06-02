import {FC} from "react";
import {NotFoundLabel} from "@modules/NotFoundLabel";

export const NotFound: FC = () => {
    return (
        <div className="w-full h-full bg-gradient-to-br from-1 via-2 to-3 flex items-center"><NotFoundLabel/></div>

    );
};
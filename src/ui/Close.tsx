import {FC} from "react";
import {ReactComponent as CloseIcon} from "@assets/icons/CloseIcon.svg";

type CloseType = {
    onClick: () => void;
}
export const Close: FC<CloseType> = ({onClick}) => {
    return (
        <div onClick={onClick} className="w-10 h-10 flex justify-center items-center relative noSelect group"
        >
            <CloseIcon className="w-6 h-6  "/>
            <div
                className="w-full h-full bg-main-4 rounded-lg opacity-0 group-hover:opacity-30 absolute transition-all duration-200 ease-in-out"></div>
        </div>
    );
};
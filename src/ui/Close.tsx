import {FC} from "react";
import {ReactComponent as CloseIcon} from "@assets/icons/CloseIcon.svg";

type CloseType = {
    onClick: () => void;
}
export const Close: FC<CloseType> = ({onClick}) => {
    return (
        <button onClick={onClick} className="w-12 h-12 flex justify-center items-center relative noSelect group"
        >
            <CloseIcon className="w-8 h-8  "/>
            <div
                className="w-full h-full bg-main-4 rounded-lg opacity-0 group-hover:opacity-30 absolute transition-all duration-200 ease-in-out"></div>
        </button>
    );
};
import {FC} from "react";
import {ReactComponent as BurgerIcon} from "@assets/icons/BurgerIcon.svg";

type BurgerProps = {
    onClick: () => void;
}

export const Burger: FC<BurgerProps> = ({onClick}) => {
    return (
        <button className=" cursor-pointer noSelect block" onClick={onClick}>
            <BurgerIcon className="w-[55px] h-[55px] noSelect"/>
        </button>
    );
};
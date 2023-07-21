import {FC} from "react";


type BurgerProps = {
    onClick: () => void;
}

export const Burger: FC<BurgerProps> = ({onClick}) => {
    return (
        <div className="space-y-2 cursor-pointer scale-125" onClick={onClick}>
            <span className="block w-8 h-1 bg-main-3"></span>
            <span className="block w-8 h-1 bg-main-3"></span>
            <span className="block w-5 h-1 bg-main-3"></span>
        </div>
    );
};
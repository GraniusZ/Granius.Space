import {FC} from "react";
import {Burger} from "@/ui/Burger.tsx";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {changeOpened} from "@store/slices/boardMenuSlice.ts";


export const Board: FC = () => {
    const dispatch = useAppDispatch();
    const handleClick = () => {
        dispatch(changeOpened());
    };

    return (
        <>
            <div>
                <header className="bg-main-1 w-full p-10 relative h-28">
                    <div className="md:hidden visible">
                        <Burger onClick={handleClick}/>
                    </div>
                    <span className=""></span>
                </header>
            </div>
            <div className="w-full h-full opacity-100 bg-main-2 "></div>
        </>

    );
};
import {FC} from "react";
import {Link} from "react-router-dom";

export const BoardNotFound: FC = () => {
    return (
        <div className="w-full h-full flex justify-center items-center font-mono mx-2 md:mx-6">
            <div
                className="m-auto max-w-lg w-full flex items-center justify-center flex-col bg-main-1 rounded-xl px-8 py-5 gap-2 sm:gap-4">
                <span className="text-main-4 text-lg sm:text-2xl">Oops</span>
                <span className="text-center text-main-4 text-sm sm:text-base">Sorry! Your board wasn't found</span>
                <Link to={"/"} className="text-main-6 text-sm sm:text-base cursor-pointer">
                    To your boards
                </Link>
            </div>
        </div>)
};
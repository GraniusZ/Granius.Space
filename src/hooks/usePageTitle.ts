import {useLocation} from "react-router-dom";
import {useEffect} from "react";

export const usePageTitle = (title: string | undefined): void => {
    const location = useLocation();

    useEffect(() => {
        if (title) {
            document.title = `${title} | Granius.Space`;
        }

    }, [location, title]);
};
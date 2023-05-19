import {useLocation} from "react-router-dom";
import {useEffect} from "react";

export const usePageTitle = (title:string):void => {
    const location = useLocation();

    useEffect(() => {
        document.title = `${title} | Kanban`;
    }, [location, title]);
};
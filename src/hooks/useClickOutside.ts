import { useRef, useEffect, RefObject } from "react";

const useClickOutside = (callback: () => void): RefObject<HTMLDivElement> => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const handleDelayedClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        const addDelayedListener = () => {
            timeout = setTimeout(() => {
                document.addEventListener('click', handleDelayedClick);
            }, 200);
        };

        addDelayedListener();

        return () => {
            clearTimeout(timeout);
            document.removeEventListener('click', handleDelayedClick);
        };
    }, [callback]);

    return ref;
};

export default useClickOutside;

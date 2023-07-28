import { auth } from "@/config/firebase";
import { useCallback } from "react";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {logout} from "@store/slices/userSlice.ts";

const useSignOut = () => {
    const dispatch = useAppDispatch();
    const signOut = useCallback(async () => {

            await auth.signOut().then(dispatch(logout()));

    }, [dispatch]);

    return { signOut };
};

export default useSignOut;

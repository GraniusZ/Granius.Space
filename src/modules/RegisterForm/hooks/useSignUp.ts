import { useNavigate } from "react-router-dom";
import { auth } from "@/config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { login, setLoading } from "@store/slices/userSlice";
import { useCallback, useState } from "react";
import { useRegisterFirebaseError } from "./useRegisterFirebaseErrors.ts";
import { SignUpDataType } from "types/SignUpDataType.ts";
import { useAppSelector} from "@hooks/useTypedSelector.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {FirebaseError} from "types/FirebaseErrorType.ts";

export const useSignUp = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [error, setError] = useState<string>("");
    const errorMessage = useRegisterFirebaseError();
    const loading = useAppSelector((state) => state.user.loading);

    const signUp = useCallback(
        async ({ firstName, secondName, email, password }: SignUpDataType) => {
            dispatch(setLoading(true));
            setError("");
            try {
                const userAuth = await createUserWithEmailAndPassword(auth, email, password);
                // Update the newly created user with a display name

                await updateProfile(userAuth.user, {
                    displayName: `${firstName} ${secondName}`,

                });
                // Dispatch the user information for persistence in the redux state
                dispatch(
                    login({
                        email: userAuth.user.email,
                        uid: userAuth.user.uid,
                        displayName: userAuth.user.displayName,
                    })
                );
                dispatch(setLoading(false));
                navigate("/", { replace: true });
            } catch (error) {
                dispatch(setLoading(false));
                setError(errorMessage(error as FirebaseError));
            }
        },
        [dispatch, errorMessage, navigate]
    );

    return [signUp, error, loading];
};
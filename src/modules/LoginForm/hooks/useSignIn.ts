import { useNavigate } from "react-router-dom";
import { auth } from "@/config/firebase";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {SignInDataType} from "types/SignInDataType.ts";
import { login, setLoading } from "@store/slices/userSlice";
import { useCallback, useState } from "react";
import { useLoginFirebaseErrors } from "./useLoginFirebaseErrors";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {useAppSelector} from "@hooks/useTypedSelector.ts";

export const useSignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const [errorMessage] = useLoginFirebaseErrors();
  const loading = useAppSelector((state) => state.user.loading);


  const signIn = useCallback(
    ({ rememberMe, email, password }:SignInDataType) => {
      dispatch(setLoading(true));
      setError("");
      const persistence = rememberMe
        ? browserSessionPersistence
        : browserLocalPersistence;
      setPersistence(auth, persistence)
        .then(() => {
          signInWithEmailAndPassword(auth, email, password)
            .then((userAuth) => {
              dispatch(
                login({
                    email: userAuth.user.email,
                    uid: userAuth.user.uid,
                    displayName: userAuth.user.displayName,
                })
              );
              dispatch(setLoading(false));
              navigate("/", { replace: true });
            })
            .catch((error) => {
              setError(errorMessage(error));
              dispatch(setLoading(false));
            });
        })
        .catch((error) => {
          setError(errorMessage(error));
          dispatch(setLoading(false));
        });
    },
    [dispatch, errorMessage, navigate]
  );
  return [signIn, error, loading];
};

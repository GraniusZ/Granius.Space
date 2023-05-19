import {auth} from "@/config/firebase";
import {logout} from "@store/slices/userSlice";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {useCallback} from "react";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";

export const useLogout = (): (() => Promise<void>) => {
  const dispatch = useAppDispatch();
  const navigate:NavigateFunction = useNavigate();

  return useCallback(async (): Promise<void> => {
    try {
      await auth.signOut();
      dispatch(logout());
      navigate("/", {replace: true});
    } catch (error) {
      // Handle error
    }
  }, [dispatch, navigate]);
};
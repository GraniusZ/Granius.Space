import {useAppSelector} from "@hooks/useTypedSelector.ts";

export const useIsAuth = (): boolean => {
  const user = useAppSelector((state) => state.user.user)
  return user != null;
};

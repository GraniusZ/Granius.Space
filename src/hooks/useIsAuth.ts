import { auth } from "@/config/firebase";
import {User}from "types/UserType.ts"
export const useIsAuth = ():boolean => {
  const user:User = auth.currentUser;
  return user != null;
};

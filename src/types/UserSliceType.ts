import { User as FirebaseUser } from "firebase/auth";
export type UserSliceType ={
    user: FirebaseUser | null,
    loading: boolean
}
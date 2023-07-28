import {User} from "types/UserType.ts";

export type UserSliceType = {
    user: User | null,
    loading: boolean,
}
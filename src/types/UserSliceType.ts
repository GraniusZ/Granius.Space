import {User} from "types/UserType.ts";
import {BoardType} from "types/BoardType.ts";

export type UserSliceType = {
    user: User | null,
    loading: boolean,
    boards: BoardType[],
}
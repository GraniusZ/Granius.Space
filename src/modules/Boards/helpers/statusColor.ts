import {statuses} from "@/const/statuses.ts";

export const statusColor = (boardStatus:string | undefined) =>{
    if(!boardStatus){
        return statuses[0].color
    }
    const matchingStatus = statuses.find(status => status.status === boardStatus);
    return  matchingStatus?.color;
}
import {ColumnType} from "types/ColumnType.ts";
import {TaskType} from "types/TaskType.ts";

export type BoardPageSliceType =  {
    titleChange: boolean,
    titleColumnChange:boolean,
    titleTaskChange:boolean,
    sideMenu: boolean,
	addColumn:boolean,
    columnSettings: boolean
    activeColumn: ColumnType | {},
    activeTask: TaskType | {},
    addTask:boolean,
    taskInfo:boolean
    taskInfoContentId:string
}
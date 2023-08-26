export type BoardMenuSliceType = {
    opened: boolean,
    openedBoardCreate:boolean,
    openedBoardInfo:boolean
    activeId: string | null
    openedDeleteConfirmation: boolean,
    statusChangeOpened: boolean,
}
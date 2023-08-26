import {FC} from "react";
import {ColumnType} from "types/ColumnType.ts";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {ReactComponent as CloseIcon} from "@assets/icons/CloseIcon.svg";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setActiveColumn, setColumnSettings} from "@store/slices/boardPageSlice.ts";
import useClickOutside from "@hooks/useClickOutside.ts";
import useDeleteColumn from "@modules/Board/hooks/useDeleteColumn.ts";

type ColumnSettings = {
    column: ColumnType

}
export const ColumnSettings: FC<ColumnSettings> = ({column}) => {
    const activeColumn: ColumnType = useAppSelector((state) => state.boardPage.activeColumn)
    const dispatch = useAppDispatch()
    const handleClose = () => {
        dispatch(setActiveColumn({}))
        dispatch(setColumnSettings(false))

    }
    const {handleDelete} = useDeleteColumn()
    const ref = useClickOutside(handleClose)

    return (
        (activeColumn === column) && (
            <div
                className={` absolute !z-50  rounded-lg  top-[50px] w-[245px] sm:w-[300px] bg-main-2 right-[30px] sm:right-[-30px] border border-main-7 py-2 px-3 gap-2  flex flex-col noSelect`}
                ref={ref}>
                <div className="w-full h-fit justify-center items-center relative text-sm text-main-4 sm:flex hidden ">
                    <span>Actions on the column</span>
                    <div onClick={handleClose}
                         className="p-1.5 flex justify-center absolute right-0 items-center  noSelect group"
                    >
                        <CloseIcon className="w-3 h-3   "/>
                        <div
                            className="w-full h-full bg-main-4 rounded-lg opacity-0 group-hover:opacity-30 absolute transition-all duration-200 ease-in-out"></div>
                    </div>
                </div>
                <hr className="border-0 bg-main-7 h-px w-full sm:block hidden"/>
                <div className="sm:text-sm text-xs">

                    <div className=" w-full hover:bg-main-3 px-4 z-10 py-2" onClick={handleDelete}
                    >
                        <div className=" text-main-4">Trash column</div>
                    </div>
                </div>
            </div>


        )

    );
};
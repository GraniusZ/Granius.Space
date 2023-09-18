import {FC, memo, useEffect, useRef} from "react";
import {ColumnType} from "types/ColumnType.ts";
import {Column} from "@modules/Board/components/Column.tsx";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setAddColumn, setAddTask, setColumnSettings, setColumnTitleInput} from "@store/slices/boardPageSlice.ts";
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import useClickOutside from "@hooks/useClickOutside.ts";
import {horizontalListSortingStrategy, SortableContext} from '@dnd-kit/sortable';
import {TasksListType} from "types/TasksListType.ts";
import {AnimatePresence} from "framer-motion";
import {AddNewColumn} from "@modules/Board/components/AddNewColumn.tsx";

type Columns = {
    columns: ColumnType[]
    tasksList: TasksListType[]
}

export const Columns: FC<Columns> = memo(({columns, tasksList}) => {

    const addNewColumnRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()
    const prevColumnsLength = useRef(columns.length);
    const addColumnOpened = useAppSelector((state) => state.boardPage.addColumn)


    const handleAddColumn = () => {
        dispatch(setAddTask(false))
        dispatch(setColumnSettings(false))
        dispatch(setAddColumn(true))
        dispatch(setColumnTitleInput(false))

    }
    useEffect(() => {
        if (columns.length === prevColumnsLength.current + 1) {
            if (addNewColumnRef && addNewColumnRef.current) {
                addNewColumnRef.current.scrollIntoView()
            }
        }

        prevColumnsLength.current = columns.length;
    }, [columns]);
    const handleCloseAddColumn = () => {
        if (addColumnOpened) {
            dispatch(setAddColumn(false))
        }
    }
    const ref = useClickOutside(handleCloseAddColumn)
    return (

        <div
            className="absolute w-full h-full overflow-y-hidden  min-h-full flex top-0 left-0  bg-main-2 px-5  overflow-x-scroll scroll-smooth flex-row gap-6 sm:gap-12 pt-6 pb-8 ">

            <SortableContext
                items={columns}
                strategy={horizontalListSortingStrategy}

            >  {columns.map((column: ColumnType,) => (
                    <Column
                        key={column.id}
                        id={column.id}
                        column={column}
                        tasksList={tasksList}/>

            ))}
                <div
                    className="  !whitespace-nowrap text-lg font-semibold text-main-1 min-w-[300px] w-[300px] snap-center relative flex justify-start box-border px-6 pr overflow-y-hidden  noSelect"
                    onClick={handleAddColumn} ref={addNewColumnRef}>
                    <div className="w-full h-fit relative flex items-center mt-4 cursor-pointer " ref={ref}>
                            <span
                                className="hover:text-main-3 duration-200 transition-all ease-in-out">Add New Column</span>

                        {addColumnOpened &&
                            <AnimatePresence><AddNewColumn/></AnimatePresence>}
                    </div>


                </div>
            </SortableContext>


        </div>


    );
});
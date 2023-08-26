import {FC, memo, useCallback, useMemo, useState} from "react";
import {BoardType} from "types/BoardType.ts";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import {Link} from "react-router-dom";
import {time} from "@modules/Boards/helpers/time.ts";
import {ReactComponent as SettingsIcon} from "@assets/icons/SettingsIcon.svg";
import {ReactComponent as ArrowUpIcon} from "@assets/icons/ArrowUpIcon.svg";
import {ReactComponent as ArrowDownIcon} from "@assets/icons/ArrowDownIcon.svg";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setActiveId, setBoardInfo} from "@store/slices/boardMenuSlice.ts";
import {statusColor} from "@modules/Boards/helpers/statusColor.ts";

type Table = {
    boards: BoardType[]
}

export const Table: FC<Table> = memo(({boards}) => {

    const [sorting, setSorting] = useState<SortingState>([])
    const columnHelper = createColumnHelper<BoardType>()
    const dispatch = useAppDispatch();
    const handleOpenInfo = useCallback((id: string) => {
        dispatch(setActiveId(id));
        dispatch(setBoardInfo(true));
    }, [dispatch]);

    const columns = useMemo(() => [
        columnHelper.accessor("title", {

            cell: info => <div
                className="flex flex-row justify-center items-center relative ellipsis max-w-[170px] sm:max-w-[250px] md:max-w-[400px]">
                <button
                    className="group/remove p-1 ml-2 absolute left-0.5 h-fit w-fit flex justify-center rounded-lg svg items-center"
                    onClick={() => handleOpenInfo(info.row.original.id)}>
                    <SettingsIcon className="w-5 h-5 z-50 fixed; left-0 right-0 top-auto bottom-0 svg"/>
                    <div
                        className="absolute w-full h-full opacity-0 group-hover/remove:opacity-60 rounded-full bg-main-4 top-0 bottom-0 m-auto transition-opacity svg duration-400 ease-in-out "
                    ></div>
                </button>
                <Link
                    className={"px-12 py-3 w-full h-full block hover:text-main-7 duration-100 transition-all ease-in ellipsis overflow-x-hidden"}
                    to={`/board/${info.row.original.id}`}><span>{info.getValue()}</span></Link>
            </div>,
            header: () => <div className="pl-6   w-fit"><span className="uppercase">Title</span></div>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('status', {
            cell: info => <div className={"px-6 py-3 "}><span
                className="py-1 px-2 rounded-xl"
                style={{background: statusColor(info.row.original.status)}}>{info.getValue()}</span></div>,
            header: () => <div className=" w-fit relative"><span className="uppercase">Status</span>
            </div>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('author', {
            cell: info => <div className={"px-6 py-3"}><span>{info.getValue()}</span></div>,
            header: () => <div className=" w-fit"><span className="uppercase">Author</span></div>,
            footer: info => info.column.id,
        }),

        columnHelper.accessor('date', {
            header: () => <div className=" w-fit"><span className="uppercase">Last modified time</span></div>,
            cell: info => <div className={"px-6 py-3"}><span>{time(info.getValue()).toLocaleString()}</span></div>,
            footer: info => info.column.id,
        }),


    ], [columnHelper, handleOpenInfo])
    const table = useReactTable({
        data: boards,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        (boards.length !== 0) && <table

            className="mt-1 w-full text-left  border-separate border-spacing-0 box-border table-auto overflow-x absolute top-0 left-0 table max-w-[2000px]">
            <thead className="w-fit">
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}
                    className="[&>*:first-child]:sticky [&>*:first-child]:left-0 relative [&>*:first-child]:border-r-2 [&>*:first-child]:bg-main-2 [&>*:first-child]:ml-[1px] [&>*:first-child]:z-10 text-main-1 text-opacity-80 font-semibold text-xs  !whitespace-nowrap ">
                    {headerGroup.headers.map(header => (

                        <th key={header.id}
                            className=" border-b-2  border-main-7 !whitespace-nowrap max-w-[100px] "
                            colSpan={header.colSpan}>
                            {header.isPlaceholder ? null : (
                                <div
                                    {...{
                                        className: header.column.getCanSort()
                                            ? 'cursor-pointer select-none flex flex-row items-center px-6 py-3 gap-2 w-fit'
                                            : '',
                                        onClick: header.column.getToggleSortingHandler(),
                                    }}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,

                                        header.getContext(),
                                    )}
                                    {{
                                        asc: <ArrowUpIcon className="w-4 h-4"/>,
                                        desc: <ArrowDownIcon className="w-4 h-4"/>,
                                    }[header.column.getIsSorted() as string] ?? null}
                                </div>
                            )}
                        </th>


                    ))}
                </tr>
            ))}
            </thead>
            <tbody className="w-fit relative">
            {table.getRowModel().rows.map(row => (

                <tr key={row.id}
                    className=" [&>*:first-child]:z-10  [&>*:first-child]:sticky [&>*:first-child]:left-0 relative [&>*:first-child]:border-r-2 [&>*:last-child]:border-r [&>*:first-child]:overflow-a [&>*:first-child]:bg-main-2 [&>*:first-child]:ml-[1px] text-main-4 text-sm  border-x group/row ">
                    {row.getVisibleCells().map(cell => (
                        <td key={cell.id}
                            className=" border-b  border-main-7 bg-main-2 font-medium max-w-[400px] w-fit text-ellipsis overflow-x-hidden !whitespace-nowrap group-hover/row:bg-main-1 ">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}

                </tr>
            ))}
            </tbody>
        </table>

    );
});
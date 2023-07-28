import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {BoardType} from "types/BoardType.ts";
import {collection, CollectionReference, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setCloseBoardDelete} from "@store/slices/boardMenuSlice.ts";
import {useDeleteBoardMutation, useGetBoardsQuery} from "@/api/boardsApi.ts";
import {setOnline} from "@store/slices/networkSlice.ts";
import {useState} from "react";

const useDeleteBoard = () =>{
	const user = useAppSelector((state) => state.user.user);
	const {data} = useGetBoardsQuery(user.uid, {skip: !user.uid});
	const boards = data || [];
	const deleteId = useAppSelector((state) => state.boardMenu.deleteId);
	const dispatch = useAppDispatch();
	const [deleteBoard] = useDeleteBoardMutation()
	const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>( null); // Добавляем состояние для таймера

	const handleDelete = async () =>{
		if (deleteTimer) {
			clearTimeout(deleteTimer);
		}
		if (!navigator.onLine) {
			dispatch(setOnline(false))
			const newTimer = setTimeout(() => dispatch(setOnline(true)), 3000);
			setDeleteTimer(newTimer);
			return;
		}
		const newBoards = boards
			.filter((board: BoardType) => board.id !== deleteId)
			.map((board: BoardType, index: number) => {
				return {...board, order: index};
			});
		const boardsRef: CollectionReference = collection(db, `users/${user.uid}/boards`);
		const boardRef = doc(collection(db, `users/${user.uid}/boards`), deleteId);

		await Promise.all([
			deleteBoard({boards: newBoards, userId: user.uid, boardRef: boardRef, boardsRef: boardsRef, deleteId: deleteId}),
			dispatch(setCloseBoardDelete())
		])

	}

	return{
		handleDelete
	}

}
export default useDeleteBoard;
import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {BoardType} from "types/BoardType.ts";
import {collection, CollectionReference, doc, writeBatch} from "firebase/firestore";
import {db} from "@/config/firebase";

import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import { setCloseBoardDelete} from "@store/slices/boardMenuSlice.ts";
import {setBoards} from "@store/slices/userSlice.ts";

const useDeleteBoard = () =>{
	const user = useAppSelector((state) => state.user.user);
	const boards = useAppSelector((state) => state.user.boards);
	const deleteId = useAppSelector((state) => state.boardMenu.deleteId);
	const dispatch = useAppDispatch();
	const handleDelete = async () =>{

		const newBoards = boards.filter((board: BoardType) => board.id !== deleteId);


		const ref: CollectionReference = collection(db, `users/${user.uid}/boards`);
		const boardRef = doc(collection(db, `users/${user.uid}/boards`), deleteId);
		// Create a write batch
		const batch = writeBatch(db);
		batch.delete(boardRef);
		// Update the order of all boards based on their new index in the batch
		newBoards.forEach((board:BoardType, index:number) => {
			const docRef = doc(ref, board.id);
			batch.update(docRef, { order: index });
		});

		// Commit the batch to execute all update operations at once
		await Promise.all([
			batch.commit(),
			dispatch(setBoards(newBoards)),
			dispatch(setCloseBoardDelete())
		])

	}

	return{
		handleDelete
	}

}
export default useDeleteBoard;
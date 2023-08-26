import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {collection, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {setBoardInfo, setDeleteConfirmation} from "@store/slices/boardMenuSlice.ts";
import {useDeleteBoardMutation} from "@/api/boardsApi";
import {setOnline} from "@store/slices/networkSlice.ts";
import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

const useDeleteBoard = () =>{
	const location = useLocation()
	const user = useAppSelector((state) => state.user.user);
	const deleteId = useAppSelector((state) => state.boardMenu.activeId);
	const dispatch = useAppDispatch();
	const [deleteBoard] = useDeleteBoardMutation()
	const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>( null); // Добавляем состояние для таймера
	const navigate = useNavigate();
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

		const boardRef = doc(collection(db, `users/${user.uid}/boards`), deleteId);

		await Promise.all([
			deleteBoard({userId: user.uid, boardRef: boardRef, deleteId: deleteId}),
			dispatch(setOnline(true)),
			dispatch(setBoardInfo(false)),
			dispatch(setDeleteConfirmation(false))
		]).then(() => {
			if (location.pathname.includes("board")) {
				return navigate("/")
			}
		})

	}

	return{
		handleDelete
	}

}
export default useDeleteBoard;
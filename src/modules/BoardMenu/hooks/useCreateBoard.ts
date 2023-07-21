import {useAppSelector} from "@hooks/useTypedSelector.ts";
import {collection, doc, writeBatch} from "firebase/firestore";
import {db} from "@/config/firebase";
import {BoardType} from "types/BoardType.ts";
import {setCloseBoardCreate} from "@store/slices/boardMenuSlice.ts";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";


const useCreateBoard = () => {
    const user = useAppSelector((state) => state.user.user);
    const localBoards = useAppSelector((state) => state.user.boards);
    const dispatch = useAppDispatch();
    const handleAdd = async (data: BoardType) => {
        // Присвоюємо новій дошці номер 0
        const newBoardData = {
            ...data,
            order: 0,
        };

        const updatedBoards = localBoards.map((board: BoardType) => ({
            ...board,
            order: board.order + 1,
        }));

        const collectionRef = collection(db, `users/${user.uid}/boards`);

        // Створюємо пакетний запис (batch)
        const batch = writeBatch(db);

        updatedBoards.forEach((board: BoardType) => {
            const docRef = doc(collectionRef, board.id);
            batch.update(docRef, {order: board.order});
        });

        const newDocRef = doc(collectionRef);
        newBoardData.id = newDocRef.id;
        batch.set(newDocRef, newBoardData);

        await Promise.all([
            batch.commit(),
            dispatch(setCloseBoardCreate())
        ]);
    };

    return {
        handleAdd,
    };
};

export default useCreateBoard;
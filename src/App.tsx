import {routes} from "@utils/routes.tsx"
import {RouterProvider} from "react-router-dom";
import {useAppDispatch} from "@hooks/useTypedDispatch.ts";
import {useEffect, useState} from "react";
import {auth} from "@/config/firebase";
import {login} from "@store/slices/userSlice.ts";
import {User} from "types/UserType.ts"
import {Layout} from "@modules/Layout";

function App() {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(
        () =>
            auth.onAuthStateChanged(function (user: User | null) {
                if (user) {
                    dispatch(
                        login({
                            email: user.email,
                            uid: user.uid,
                            displayName: user.displayName,
                        })
                    );
                }
                setLoading(false);
            }),
        [dispatch]
    );
    if (loading) {
        return <Layout loading={loading}/>
    }
    return (
        <>
            <RouterProvider router={routes}/>s
        </>
    )
}

export default App

import {createBrowserRouter} from "react-router-dom";
import {Home} from "@pages/Home/Home.tsx";
import {Login} from "@pages/Login/Login.tsx";
import {Register} from "@pages/Register/Register.tsx";
import {Layout} from "@modules/Layout/components/Layout.tsx";
import {NotFound} from "@pages/NotFound/NotFound.tsx";


export const routes = createBrowserRouter([

    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                index:true,
                element:<Home/>
            },

            {

                path: "login",
                element: <Login/>,

            },
            {
                path: "register",
                element: <Register/>,

            },
            {
                path: "*",
                element: <NotFound/>,
            },

        ],
    },
]);

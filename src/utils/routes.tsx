import {createBrowserRouter} from "react-router-dom";
import {Home} from "@pages/Home/Home.tsx";
import {Login} from "@pages/Login/Login.tsx";
import {Register} from "@pages/Register/Register.tsx";
import {AuthLayout} from "@modules/AuthLayout/components/AuthLayout.tsx";


export const routes = createBrowserRouter([
    {
        path: "/",
        children: [
            {
                index:true,
                element:<Home/>
            },
            {
                element: <AuthLayout/>,
                children:[
                    {

                        path: "login",
                        element: <Login />,

                    },
                    {
                        path: "register",
                        element: <Register/>,

                    },
                ]
            },

        ],
    },
]);

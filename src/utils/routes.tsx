import {createBrowserRouter} from "react-router-dom";
import {Home} from "@pages/Home/Home.tsx";
import {Login} from "@pages/Login/Login.tsx";
import {Register} from "@pages/Register/Register.tsx";
import {Layout} from "@modules/Layout/components/Layout.tsx";
import {NotFound} from "@pages/NotFound/NotFound.tsx";
import {BoardPage} from "@pages/Board/BoardPage.tsx";
import {BoardsLayout} from "@modules/BoardsLayout";
import {BoardLayout} from "@modules/BoardLayout";


export const routes = createBrowserRouter([

    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                element: <BoardsLayout/>,
                children:[
                    {
                        index:true,
                        element:<Home/>
                    },
                    {
                        path: "/board/:id",
                        element: <BoardLayout/>,
                        children:[{
                            element:<BoardPage/>,
                            index:true,
                        }],
                    },
                ],


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

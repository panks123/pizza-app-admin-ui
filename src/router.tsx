import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/login";
import Tenants from "./pages/tenants/Tenants";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import Users from "./pages/users/Users";
import NotFound from "./pages/notFound/NotFound";
import Products from "./pages/products/Products";

const privateRoutes = [
    {
        path: "users",
        element: <Users />,
    },
    {
        path: "restaurants",
        element: <Tenants />,
    },
    {
        path: "products",
        element: <Products />
    }
];

const publicRoutes = [
    {
        path: "login",
        element: <LoginPage />
    }
]
    
export const MainRouter = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root />,
            errorElement: <NotFound />,
            children: [
                {
                    path: "",
                    element: <Dashboard />, // authenticated
                    children: [
                        {
                            path: "",
                            element: <HomePage />
                        },
                        ...privateRoutes
                    ]
                },
                {
                    path: "auth",
                    element: <NonAuth />, // Non-authenticated
                    children: [...publicRoutes]
                },
            ]
        }
    ]);

    return <RouterProvider router={router}/>
}
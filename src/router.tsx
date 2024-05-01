import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/login";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import Users from "./pages/users/Users";
import { UserRole } from "./config";
import { useAuthStore } from "./store";
import NotFound from "./pages/notFound/NotFound";
import { useMemo } from "react";

const privateRoutes = [
    {
        path: "users",
        element: <Users />,
        allowedroles: [UserRole.ADMIN]
    },
    {
        path: "categories",
        element: <div>Categories</div>,
        allowedroles: [UserRole.ADMIN, UserRole.MANAGER]
    }
]
const getRoleBasedPrivateRoutes = (userRole: string) => {
    const routes = privateRoutes.filter((route) => route.allowedroles.includes(userRole));
    return routes;
}

export const MainRouter = () => {
    const { user } = useAuthStore();

    const routes = useMemo(()=> {
        if(!user) {
            return [
                {
                    path: "/",
                    element: <Root />,
                    errorElement: <NotFound />,
                    children: [
                        {
                            path: "",
                            element: <Dashboard />,
                            children: [
                                {
                                    path: "",
                                    element: <HomePage />
                                },
                            ]
                        },
                        {
                            path: "auth",
                            element: <NonAuth />,
                            children: [
                                {
                                    path: "login",
                                    element: <LoginPage />
                                }
                            ]
                        },
                    ]
                }
            ]
        }

        return [
            {
                path: "/",
                element: <Root />,
                errorElement: <NotFound />,
                children: [
                    {
                        path: "",
                        element: <Dashboard />,
                        children: [
                            {
                                path: "",
                                element: <HomePage />
                            },
                            ...getRoleBasedPrivateRoutes(user?.role as string)
                        ]
                    },
                    {
                        path: "auth",
                        element: <NonAuth />,
                        children: [
                            {
                                path: "login",
                                element: <LoginPage />
                            }
                        ]
                    },
                ]
            }
        ]
    }, [user])

    const router = createBrowserRouter(routes);

    return <RouterProvider router={router}/>
}
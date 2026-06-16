import { createBrowserRouter } from "react-router";
import Home from "./features/chat/pages/Home.jsx";
import RegisterPage from "./features/auth/pages/Register.jsx";
import LoginPage from "./features/auth/pages/Login.jsx";
import Protected from "./features/auth/components/ProcetedRoute.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Protected>
                <Home />
            </Protected>
        )
    },
    { path: "/register", element: <RegisterPage /> },
    { path: "/login", element: <LoginPage /> },
]);

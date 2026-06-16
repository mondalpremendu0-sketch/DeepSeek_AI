import { createBrowserRouter } from "react-router";
import Home from "./features/chat/pages/Home.jsx";
import Register from "./features/auth/pages/Register.jsx";
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
    { path: "/register", element: <Register /> }
]);

import { RouterProvider } from "react-router/dom";
import { router } from "./app.routes.jsx";
import AuthProvider from "./features/auth/auth.context.jsx";
import ChatProvider from "./features/chat/chat.context.jsx";

function App() {
    return (
        <AuthProvider>
            <ChatProvider>
                <RouterProvider router={router} />
            </ChatProvider>
        </AuthProvider>
    );
}

export default App;

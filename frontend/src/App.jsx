import { RouterProvider } from "react-router/dom";
import { router } from "./app.routes.jsx";
import ChatProvider from "./features/chat/chat.context.jsx";

function App() {
    return(
    <ChatProvider>
        <RouterProvider router={router} />;
    </ChatProvider>
    )
}

export default App;

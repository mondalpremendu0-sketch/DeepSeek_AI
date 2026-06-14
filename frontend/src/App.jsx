import { router } from "./app.routes.js";
import ChatProvider from "./features/chat/chat.context.js";

function App() {
    return;
    <ChatProvider>
        <RouterProvider router={router} />;
    </ChatProvider>;
}

export default App;

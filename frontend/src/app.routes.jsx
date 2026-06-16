import { createBrowserRouter } from "react-router";
import  Home from "./features/chat/pages/Home.jsx";
import  Register from './features/auth/pages/Register.jsx'



export const router = createBrowserRouter([
  {path:"/",element:<Home />},
  {path:"/register",element:<Register />},
  ])
  
  
import {
    createBrowserRouter,
} from "react-router-dom"
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage></LoginPage>,
    },
    {
        path: "/Home",
        element: <HomePage />,
    },
]);


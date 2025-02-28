import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home"; 
import Register from "../pages/Register/Register"


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div></div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute allowedRoles={["user", "admin"]}>
        <div></div>
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <Navigate to="/home" replace /> },
]);

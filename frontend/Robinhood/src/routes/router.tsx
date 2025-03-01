import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home"; 
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />, // ✅ Protected route wrapper
    children: [{ path: "", element: <Dashboard /> }],
  },
  {
    path: "/admin",
    element: <ProtectedRoute />, // ✅ Protected route wrapper
    children: [{ path: "", element: <div>Admin Page</div> }],
  },
  {
    path: "/user",
    element: <ProtectedRoute allowedRoles={["user", "admin"]} />,
    children: [{ path: "", element: <div>User Page</div> }],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home"; 
import Register from "../pages/Register/Register";
import Map from "../pages/Map/Map";
import FormPage from "../components/ui/Form/form"


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path:"/form",
    element:<FormPage/>
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
    path:"/map",
    element: <Map/>,
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

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../button"; // Adjust the path as needed
import { useAuth } from "../../../context/AuthContext";
import axiosclient from "../AxiosClient/axiosclient";

export default function SponserHeader() {
    const { user, verifyUser } = useAuth();
  
    const handleLogout = async () => {
      try {
        await axiosclient.get("/logout", { withCredentials: true });
        await verifyUser();
        window.location.href = "/login";
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };
  return (
    <header className="bg-green-700 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">Robin Hood Army</h1>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-gray-300 transition">Donate</Link>
          <Link to="/about" className="hover:text-gray-300 transition">Distribution Center List</Link>
          <Link to="/get-involved" className="hover:text-gray-300 transition">Dashboard</Link>
          <Link to="/contact" className="hover:text-gray-300 transition">Contact</Link>
        </nav>

        {/* Join Now Button */}
        <Button variant="default" asChild>
          <Link to="/login" onClick={handleLogout}>Logout</Link>
        </Button>
      </div>
    </header>
  );
}

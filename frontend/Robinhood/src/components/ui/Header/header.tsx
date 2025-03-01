import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../button";
import { useAuth } from "../../../context/AuthContext"; // Adjust the path as needed

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Simple logout handler: you can expand this to call an API or clear tokens as needed.
  const handleLogout = () => {
    // Clear user-related tokens or state here.
    // For instance, localStorage.removeItem("authToken");
    // Then navigate to login page:
    navigate("/login");
  };

  return (
    <header className="bg-green-700 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">Robin Hood Army</h1>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-gray-300 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-gray-300 transition">
            About Us
          </Link>
          <Link to="/get-involved" className="hover:text-gray-300 transition">
            Get Involved
          </Link>
          <Link to="/contact" className="hover:text-gray-300 transition">
            Contact
          </Link>
        </nav>

        {/* Conditional Button */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">Hello, {user.user}</span>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <Button variant="default" asChild>
            <Link to="/login">Join Now</Link>
          </Button>
        )}
      </div>
    </header>
  );
}

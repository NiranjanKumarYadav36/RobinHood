import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../button";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-green-700 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">Robin Hood Army</h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-gray-300 transition">Home</Link>
          <Link to="/about" className="hover:text-gray-300 transition">About Us</Link>
          <Link to="/get-involved" className="hover:text-gray-300 transition">Get Involved</Link>
          <Link to="/contact" className="hover:text-gray-300 transition">Contact</Link>
        </nav>

        {/* Join Now Button (ONLY visible on Desktop) */}
        <div className="hidden md:block">
          <Button className="bg-white hover:bg-gray-200 text-green-600 px-4 py-2" asChild>
            <Link to="/login">Join Now</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white text-2xl ml-4">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-green-800 py-4">
          <nav className="flex flex-col items-center gap-4">
            <Link to="/" className="hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/about" className="hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>About Us</Link>
            <Link to="/get-involved" className="hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>Get Involved</Link>
            <Link to="/contact" className="hover:text-gray-300 transition" onClick={() => setIsOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

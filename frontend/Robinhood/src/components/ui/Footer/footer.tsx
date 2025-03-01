import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 text-center pt-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Social Media Icons */}
        <div className="flex gap-6 mb-4 md:mb-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-500 transition">
            <FaFacebook />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-pink-500 transition">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-400 transition">
            <FaTwitter />
          </a>
        </div>
        
        {/* Contact Information */}
        <div>
          <h2 className="text-lg font-semibold">Contact Us</h2>
          <p className="text-gray-400">Phone: +91 9354527267</p>
          <p className="text-gray-400">Email: info@robinhoodarmy.com</p>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="mt-6 text-gray-500 text-sm">© 2025 Robin Hood Army Mumbai. All Rights Reserved.</div>
    </footer>
  );
}

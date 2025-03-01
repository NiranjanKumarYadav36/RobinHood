import React from "react";
import { useAuth } from "../../../context/AuthContext";
import axiosclient from "../AxiosClient/axiosclient";
import SponserHeader from "../Header/sponserHeader";
import VolunteerHeader from "./volunteerHeader";
import VolunteerT2Header from "../Header/volunteerT2Header";
import DistributionCenterHeader from "../Header/distributionCenterHeader";
import { FaTimes, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from "../button";

export default function Header() {
  const { user, verifyUser } = useAuth(); // ✅ Get user & verifyUser from context

  const handleLogout = async () => {
    try {
      await axiosclient.get("/logout", { withCredentials: true }); // Call backend logout API
      await verifyUser(); // ✅ Refresh user data after logout
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Dynamically render header based on user role
  // console.log(user.user); 
  switch (user?.user) {
    case "sponsor":
      return <SponserHeader />;
    case "distribution_center":
      return <DistributionCenterHeader />;
    case "volunteer_t2":
      return <VolunteerT2Header />;
    case "volunteer":
      return <VolunteerHeader />;
    default:
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
          </div>
        </header>
      ); // No header if user role is not found
  }
}

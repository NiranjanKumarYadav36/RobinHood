import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { FaHandsHelping, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate(); // Hook for navigation
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="bg-green-600 text-white text-center py-20">
        <h1 className="text-5xl font-bold">Robin Hood Army Mumbai</h1>
        <p className="mt-4 text-lg">Join us in fighting hunger and food waste!</p>
        <Button className="mt-6 bg-white text-green-600 hover:bg-gray-200" onClick={() => navigate("/login")}>Join Us</Button>
      </section>

      {/* About Section */}
      <section className="container mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center">About Us</h2>
        <p className="text-lg mt-4 text-center max-w-2xl mx-auto">
          The Robin Hood Army is a volunteer-based organization that collects surplus food from restaurants and distributes it to those in need.
        </p>
      </section>

      {/* Get Involved */}
      <section className="bg-gray-200 py-16 px-6">
        <h2 className="text-3xl font-bold text-center">Get Involved</h2>
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          <Card className="max-w-sm">
            <CardContent className="p-6 text-center">
              <FaHandsHelping className="text-green-600 text-5xl mx-auto" />
              <h3 className="text-xl font-bold mt-4">Volunteer</h3>
              <p className="mt-2">Join our team to distribute food to those in need.</p>
            </CardContent>
          </Card>
          <Card className="max-w-sm">
            <CardContent className="p-6 text-center">
              <FaHandsHelping className="text-green-600 text-5xl mx-auto" />
              <h3 className="text-xl font-bold mt-4">Donate Food</h3>
              <p className="mt-2">Help us by donating surplus food from your restaurant.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="text-center py-16 px-6">
        <h2 className="text-3xl font-bold">Connect With Us</h2>
        <div className="flex justify-center gap-4 mt-4">
          <FaFacebook className="text-3xl text-blue-600 cursor-pointer" />
          <FaInstagram className="text-3xl text-pink-600 cursor-pointer" />
          <FaTwitter className="text-3xl text-blue-400 cursor-pointer" />
        </div>
      </section>
    </div>
  );
}

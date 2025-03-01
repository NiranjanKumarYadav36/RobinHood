import { Card, CardContent } from "../../components/ui/card";
import { FaHandsHelping} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/ui/Footer/footer"
import Header from "../../components/ui/Header/header"

export default function Home() {

  const navigate = useNavigate(); // Hook for navigation
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <Header></Header>

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
        <Card
          className="max-w-sm cursor-pointer transition transform hover:scale-105"
          onClick={() => navigate("/register")}
        >
          <CardContent className="p-6 text-center">
            <FaHandsHelping className="text-green-600 text-5xl mx-auto" />
            <h3 className="text-xl font-bold mt-4">Volunteer</h3>
            <p className="mt-2">Join our team to distribute food to those in need.</p>
          </CardContent>
        </Card>

        <Card
          className="max-w-sm cursor-pointer transition transform hover:scale-105"
          onClick={() => navigate("/register")}
        >
          <CardContent className="p-6 text-center">
            <FaHandsHelping className="text-green-600 text-5xl mx-auto" />
            <h3 className="text-xl font-bold mt-4">Donate Food</h3>
            <p className="mt-2">Help us by donating surplus food from your restaurant.</p>
          </CardContent>
        </Card>
        </div>
      </section>

      {/* Contact Section */}
      <Footer></Footer>
     
    </div>
  );
}

import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosclient from "../AxiosClient/axiosclient"; // Use your Axios instance

export default function LogoutButton() {
  const { setUser } = useAuth(); // Update auth state
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend logout API
      await axiosclient.post("/logout", {}, { withCredentials: true });

      // Remove token from storage
      localStorage.removeItem("authToken");

      // Reset auth state
      setUser(null);

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
}

  
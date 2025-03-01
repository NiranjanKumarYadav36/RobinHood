import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosclient from "../components/ui/AxiosClient/axiosclient";

interface User {
  location?: any; // Ensure this is optional if not always available
  id: string;
  user: string;
  state: string;
  city: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  verifyUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Define verifyUser before using it
  const verifyUser = async () => {
    try {
      const response = await axiosclient.get("/protected", { withCredentials: true });
      if (response.data.success) {
        const { id, user, state, city, location } = response.data; // Ensure all fields exist
        setUser({ id, user, state, city, location });

        console.log("User successfully verified:", { id, user, state, city, location });
      }
    } catch (error) {
      console.error("User verification failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // useEffect should have verifyUser properly referenced
  useEffect(() => {
    verifyUser();
  }, []); // No missing dependencies

  return (
    <AuthContext.Provider value={{ user, loading, verifyUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};


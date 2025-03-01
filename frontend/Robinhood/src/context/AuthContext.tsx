import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosclient from "../components/ui/AxiosClient/axiosclient";

interface User {
  id: string;
  role: string;
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

  useEffect(() => {
    verifyUser();
  }, []);

  const verifyUser = async () => {
    try {
      const response = await axiosclient.get("/protected", { withCredentials: true });
      if (response.data.success) {
        setUser(response.data.user);
        console.log(response.data.user)
      } else {
        setUser(null);
        console.log("error")
      }
    } catch (error) {
      console.error("User verification failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

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

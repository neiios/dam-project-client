import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/users/verify`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        await AsyncStorage.removeItem("jwtToken");
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      await AsyncStorage.setItem("jwtToken", token);
    };

    checkAuth();
  }, []);

  async function login(token: string) {
    await AsyncStorage.setItem("jwtToken", token);
    setIsAuthenticated(true);
  }

  async function logout() {
    await AsyncStorage.removeItem("jwtToken");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

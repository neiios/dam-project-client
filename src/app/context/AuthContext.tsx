import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: "admin" | "user" | null;
  validateAuth: () => Promise<void>;
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
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);

  const validateToken = useCallback(async () => {
    const token = await AsyncStorage.getItem("jwtToken");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    const response = await fetch(
      `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/users/profile`,
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

    const { role } = await response.json();
    setIsAuthenticated(true);
    setUserRole(role);
    await AsyncStorage.setItem("jwtToken", token);
  }, []);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, validateAuth: validateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

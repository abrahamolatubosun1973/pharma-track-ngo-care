
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "state_manager" | "facility_manager" | "pharmacist";
  location?: {
    type: "central" | "state" | "facility";
    id: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock API response data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@caritas.org",
    password: "admin123",
    role: "admin" as const,
    location: { 
      type: "central" as const, 
      id: "central", 
      name: "CARITAS HQ" 
    }
  },
  {
    id: "2",
    name: "Abia Manager",
    email: "abia@caritas.org",
    password: "state123",
    role: "state_manager" as const,
    location: { 
      type: "state" as const, 
      id: "abia", 
      name: "Abia State" 
    }
  },
  {
    id: "3",
    name: "Facility User",
    email: "facility@caritas.org",
    password: "facility123",
    role: "facility_manager" as const,
    location: { 
      type: "facility" as const, 
      id: "facility1", 
      name: "General Hospital Umuahia" 
    }
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("pharmaTrackUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data", error);
        localStorage.removeItem("pharmaTrackUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (foundUser) {
          // Remove password before storing
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem("pharmaTrackUser", JSON.stringify(userWithoutPassword));
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error("Invalid email or password"));
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem("pharmaTrackUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

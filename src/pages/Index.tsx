
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pharma-100 via-background to-wellness-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-pharma-800">PharmTrack NGO Care</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Loading application...
        </p>
      </div>
    </div>
  );
};

export default Index;

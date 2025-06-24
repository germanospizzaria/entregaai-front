import { useNavigate } from "react-router";
import { useAuth } from "../auth/hooks/use-auth";
import { useEffect } from "react";

const Home = () => {
  const { isAuthenticated, userId, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && userId && role) {
      navigate(`/${role}`);
    }
  }, [isAuthenticated, userId, role, navigate]);

  return <div></div>;
};

export default Home;

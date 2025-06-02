import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useEffect, useRef } from "react";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

export default function Oauthlogin() {
  const { login } = useUser();
  const navigate = useNavigate();
  const executed = useRef(false);

  useEffect(() => {
    if (executed.current) return; // Evita ejecución doble
    executed.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userInfoParam = params.get("userinfo");

    console.log("Parametros obtenidos:", params.toString());

    if (userInfoParam && token) {
      try {
        const userInfo = JSON.parse(decodeURIComponent(userInfoParam));
        console.log("User Info:", userInfo);

        login(userInfo, token);
        console.log("Login successful, waiting for navigation...");
        
        setTimeout(() => {
          navigate("/panel");
          console.log("Redirecting to panel...");
        }, 300); // Espera breve para evitar ejecución prematura
      } catch (error) {
        console.error("Error al procesar userInfo:", error);
        navigate("/login");
      }
    } else {
      console.error("Token or user info not found in URL parameters.");
      navigate("/login");
    }
  }, []);

  return <LoadingScreen />;
}

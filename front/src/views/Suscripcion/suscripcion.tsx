import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

const Suscripcion: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Ref que impide ejecutar la captura más de una vez
  const captureCalledRef = useRef(false);

  useEffect(() => {
    sessionStorage.removeItem("paypal_captured"); // Limpia el flag para permitir capturas nuevas
  

    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const alreadyCaptured = sessionStorage.getItem("paypal_captured");

    console.log("location.search:", location.search);
    console.log("Token recibido:", token);
    console.log("alreadyCaptured:", alreadyCaptured);
    console.log("captureCalledRef.current:", captureCalledRef.current);

    // Si ya procesamos esta captura o no hay token → no hacemos nada
    if (!token || alreadyCaptured || captureCalledRef.current) {
      return;
    }

    // Marcamos que ya iniciamos la captura para no repetirla
    captureCalledRef.current = true;

    const captureEndpoint = `/payments/paypal/capture/${token}`;
    console.log(
      "📡 Llamando a endpoint de captura:",
      axiosInstance.defaults.baseURL + captureEndpoint
    );

    axiosInstance
      .post(captureEndpoint)
      .then((response) => {
        // Éxito si status === 201
        if (response.status === 201) {
          console.log("⏪ Respuesta del backend:", response.data);
          sessionStorage.setItem("paypal_captured", "true");
          alert("🎉 ¡Pago registrado y orden capturada correctamente!");
        }
        // Si el backend devolvió message 'ORDER_ALREADY_CAPTURED'
        else if (response.data?.message === "ORDER_ALREADY_CAPTURED") {
          console.warn("⚠️ La orden ya estaba capturada.");
          alert("ℹ️ Este pago ya fue registrado anteriormente.");
        } else {
          console.warn(
            "⚠️ Backend devolvió status distinto a 201:",
            response.data
          );
          alert("⚠️ No se pudo registrar el pago en la base de datos.");
        }

        // Navegamos al panel sin conservar el query ?token=…
        navigate("/panel", { replace: true });
      })
      .catch((err) => {
        console.error("❌ Error al capturar/guardar el pago:", err);
        if (err.response) {
          console.error("🔍 err.response.data:", err.response.data);
          alert(
            `❌ Error: ${
              err.response.data?.message || "Vuelve a intentarlo."
            }`
          );
        } else {
          alert("❌ No se pudo contactar con el servidor.");
        }
        // También redirigimos al panel para evitar repetición
        navigate("/panel", { replace: true });
      });
  }, [location.search, navigate]);

  if (!user) {
    return <p>Debes iniciar sesión para realizar el pago.</p>;
  }

  const rol = user.role as "student" | "teacher";

  const handlePago = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}`;

      const response = await axiosInstance.post(
        "/payments/create-paypal-payment",
        {
          amount: "USD",
          currency: "USD",
          type:
            rol === "student"
              ? "student_subscription"
              : "teacher_monthly_fee",
          paymentMethod: "paypal",
          month,
        }
      );

      const approvalUrl = response.data?.url;
      if (!approvalUrl) {
        alert("No se pudo obtener el enlace de aprobación de PayPal.");
        return;
      }

      window.location.href = approvalUrl;
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Hubo un error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Suscripción {rol === "student" ? "Student" : "Teacher"}
        </h1>

        <p className="text-gray-600 text-center mb-6">
          {rol === "student"
            ? "Accede a clases ilimitadas, material exclusivo y más."
            : "Crea clases ilimitadas y monetiza tu conocimiento."}
        </p>

        <div className="flex justify-center mb-8">
          <span className="text-4xl font-semibold text-blue-600">$5.99</span>
          <span className="text-gray-500 self-end ml-1">/mes</span>
        </div>

        <button
          onClick={handlePago}
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-lg transition duration-200 shadow"
        >
          {loading ? "Redirigiendo a PayPal..." : "Pagar con PayPal"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Serás redirigido al entorno seguro de PayPal para completar el pago.
        </p>
      </div>
    </div>
  );
};

export default Suscripcion;

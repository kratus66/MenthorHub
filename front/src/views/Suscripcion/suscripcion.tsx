import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

const Suscripcion: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const captureCalledRef = useRef(false);

  // --- NUEVO: estados para controlar si ya pagó y fechas de suscripción ---
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  // ------------------------------------------------------------------------

  // --- NUEVO: obtener el mes actual en formato "YYYY-MM" ---
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };
  // ------------------------------------------------------------

  // --- NUEVO: al montar, chequear si el usuario ya pagó este mes ---
  useEffect(() => {
    if (!user) return;

    const month = getCurrentMonth();
    axiosInstance
      .get(`/payments/user/${user.id}?page=1&limit=10`)
      .then((res) => {
        // Suponemos que el backend responde con { data: [...], total, page, limit }
        const pagos: any[] = Array.isArray(res.data.data) ? res.data.data : [];
        const pagoEsteMes = pagos.find(
          (p) => p.month === month && p.status === "completed"
        );
        if (pagoEsteMes) {
          setAlreadyPaid(true);

          // Asumimos que el backend incluye startDate y endDate en el objeto pago
          // Convertimos las fechas a formato legible:
          setStartDate(new Date(pagoEsteMes.startDate).toLocaleDateString());
          setEndDate(new Date(pagoEsteMes.endDate).toLocaleDateString());
        }
      })
      .catch((err) => {
        console.error("Error al verificar pagos:", err);
      });
  }, [user]);
  // ---------------------------------------------------------------------

  // Captura de PayPal cuando regresa de PayPal
  useEffect(() => {
    if (!user) return;

    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const alreadyCaptured = sessionStorage.getItem("paypal_captured");

    if (!token || alreadyCaptured || captureCalledRef.current) return;

    captureCalledRef.current = true;

    axiosInstance
      .post(`/payments/paypal/capture/${token}`)
      .then((response) => {
        if (response.status === 201) {
          sessionStorage.setItem("paypal_captured", "true");
          alert("🎉 ¡Pago registrado y orden capturada correctamente!");
        } else if (response.data?.message === "ORDER_ALREADY_CAPTURED") {
          alert("ℹ️ Este pago ya fue registrado anteriormente.");
        } else {
          alert("⚠️ No se pudo registrar el pago en la base de datos.");
        }
        navigate("/panel", { replace: true });
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        alert("❌ Ocurrió un error. Intenta nuevamente.");
        navigate("/panel", { replace: true });
      });
  }, [location.search, navigate, user]);

  if (!user) return <p>Debes iniciar sesión para realizar el pago.</p>;

  const rol = user.role as "student" | "teacher";

  const handlePago = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      const response = await axiosInstance.post("/payments/create-paypal-payment", {
        amount: "USD",
        currency: "USD",
        type: rol === "student" ? "student_subscription" : "teacher_monthly_fee",
        paymentMethod: "paypal",
        month,
      });

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

        {/* Si ya pagó, mostramos sus fechas de inicio/fin */}
        {alreadyPaid && startDate && endDate ? (
          <div className="text-center mb-8">
            <p className="text-green-600 font-semibold">Suscripción activa:</p>
            <p className="text-gray-800">
              {startDate} &nbsp;–&nbsp; {endDate}
            </p>
          </div>
        ) : (
          <div className="flex justify-center mb-8">
            <span className="text-4xl font-semibold text-blue-600">$5.99</span>
            <span className="text-gray-500 self-end ml-1">/mes</span>
          </div>
        )}

        {/* Botón de pago sólo si no ha pagado */}
        {!alreadyPaid ? (
          <button
            onClick={handlePago}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-lg transition duration-200 shadow"
          >
            {loading ? "Redirigiendo a PayPal..." : "Pagar con PayPal"}
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-600 font-medium py-3 px-6 rounded-lg transition duration-200 shadow cursor-not-allowed"
          >
            Suscripción Activa
          </button>
        )}

        <p className="text-xs text-gray-400 text-center mt-4">
          Serás redirigido al entorno seguro de PayPal para completar el pago.
        </p>
      </div>
    </div>
  );
};

export default Suscripcion;

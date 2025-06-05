/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

const Suscripcion: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const captureCalledRef = useRef(false);

  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  // Chequear si el usuario ya pagó este mes
  useEffect(() => {
    if (!user) {
      console.log("No hay usuario logueado.");
      return;
    }

    const month = getCurrentMonth();
    console.log("Verificando pagos para el mes:", month, "y usuario:", user.id);

    axiosInstance
      .get(`/payments/user/${user.id}?page=1&limit=10`)
      .then((res) => {
        console.log("Respuesta de pagos:", res.data);
        const pagos: any[] = Array.isArray(res.data.data) ? res.data.data : [];

        // 🔁 Ordena los pagos por fecha descendente y filtra solo los completados
        const pagosOrdenados = pagos
          .filter(p => p.status === "completed" && p.status !== "sandbox_deleted")
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

        const month = getCurrentMonth();
        const pagoEsteMes = pagosOrdenados.find(p => p.month === month);

        if (pagoEsteMes) {
          setAlreadyPaid(true);
          const fmtUTC = new Intl.DateTimeFormat(undefined, {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
          setStartDate(fmtUTC.format(new Date(pagoEsteMes.startDate)));
          setEndDate(fmtUTC.format(new Date(pagoEsteMes.endDate)));
          console.log("Pago encontrado para este mes:", pagoEsteMes);
        } else {
          console.log("No se encontró pago para este mes.");
        }
      })
      .catch((err) => {
        console.error("Error al verificar pagos:", err);
      });
  }, [user]);

  // Captura de PayPal cuando regresa de PayPal
  useEffect(() => {
    if (!user) {
      console.log("No hay usuario logueado para captura PayPal.");
      return;
    }

    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const alreadyCaptured = sessionStorage.getItem("paypal_captured");

    console.log("PayPal token:", token, "alreadyCaptured:", alreadyCaptured, "captureCalledRef:", captureCalledRef.current);

    if (!token || alreadyCaptured || captureCalledRef.current) return;

    captureCalledRef.current = true;

    (async () => {
      try {
        console.log("Intentando capturar pago PayPal con token:", token);
        const response = await axiosInstance.post(`/payments/paypal/capture/${token}`);
        console.log("Respuesta de captura PayPal:", response);

        if (response.status === 201) {
          sessionStorage.setItem("paypal_captured", "true");
          toast.success("🎉 ¡Pago registrado y orden capturada correctamente!");

          // --- NUEVO: enviar correo confirmando el pago ---
          await axiosInstance.post('/payments/send-payment-email', {
            email: user.email,
            paymentInfo: response.data,
          });
          console.log("Correo de confirmación enviado.");

          // --- NUEVO: Refetch de pagos para actualizar fechas ---
          await loadPagos(); // ✅ actualiza la vista con las fechas reales

        } else if (response.data?.message === "ORDER_ALREADY_CAPTURED") {
          toast.info("ℹ️ Este pago ya fue registrado anteriormente.");
          console.log("Orden ya capturada anteriormente.");
        } else {
          toast.error("⚠️ No se pudo registrar el pago en la base de datos.");
          console.log("No se pudo registrar el pago en la base de datos.");
        }
        navigate("/panel", { replace: true });
        console.log("Redirigiendo a /panel");
      } catch (err) {
        console.error("❌ Error en captura PayPal:", err);
        toast.error("❌ Ocurrió un error. Intenta nuevamente.");
        navigate("/panel", { replace: true });
      }
    })();
  }, [location.search, navigate, user]);

  const loadPagos = async () => {
    if (!user) return; // ⛔ Previene el error si user es null

    const month = getCurrentMonth();
    try {
      const res = await axiosInstance.get(`/payments/user/${user.id}?page=1&limit=10`);
      console.log("🔁 Pagos cargados:", res.data);
      const pagos: any[] = Array.isArray(res.data.data) ? res.data.data : [];

      const pagosOrdenados = pagos
        .filter(p => p.status === "completed" && p.status !== "sandbox_deleted")
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

      const pagoEsteMes = pagosOrdenados.find(p => p.month === month);

      if (pagoEsteMes) {
        setAlreadyPaid(true);
        const fmtUTC = new Intl.DateTimeFormat(undefined, {
          timeZone: 'UTC',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        setStartDate(fmtUTC.format(new Date(pagoEsteMes.startDate)));
        setEndDate(fmtUTC.format(new Date(pagoEsteMes.endDate)));
        console.log("✅ Pago aplicado:", pagoEsteMes);
      } else {
        console.log("❌ No se encontró pago para este mes.");
        setAlreadyPaid(false);
        setStartDate(null);
        setEndDate(null);
      }
    } catch (err) {
      console.error("Error al cargar pagos:", err);
    }
  };

  useEffect(() => {
    if (!user) {
      console.log("No hay usuario logueado.");
      return;
    }
    loadPagos(); // ✅ se usa aquí
  }, [user]);

  if (!user) {
    console.log("No hay usuario logueado, mostrando mensaje.");
    return <p>Debes iniciar sesión para realizar el pago.</p>;
  }

  const rol = user.role as "student" | "teacher";

  const handlePago = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      console.log("Iniciando pago para mes:", month, "rol:", rol);

      const response = await axiosInstance.post("/payments/create-paypal-payment", {
        amount: "USD",
        currency: "USD",
        type: rol === "student" ? "student_subscription" : "teacher_monthly_fee",
        paymentMethod: "paypal",
        month,
      });

      console.log("Respuesta de creación de pago PayPal:", response);

      const approvalUrl = response.data?.url;
      if (!approvalUrl) {
        toast.error("No se pudo obtener el enlace de aprobación de PayPal.");
        console.log("No se obtuvo approvalUrl de PayPal.");
        return;
      }

      console.log("Redirigiendo a PayPal:", approvalUrl);
      sessionStorage.removeItem("paypal_captured"); // ← limpia la marca previa
      window.location.href = approvalUrl;           // redirige a PayPal
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      toast.error("Hubo un error al procesar el pago.");
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

        {alreadyPaid && startDate && endDate ? (
          <div className="text-center mb-8">
            <p className="text-green-600 font-semibold">Suscripción activa:</p>
            <p className="text-gray-800">
              {startDate} &nbsp;–&nbsp; {endDate}
            </p>
          </div>
        ) : (
          <div className="flex justify-center mb-8">
            <span className="text-4xl font-semibold text-[#007AFF]">$5.99</span>
            <span className="text-gray-500 self-end ml-1">/mes</span>
          </div>
        )}

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

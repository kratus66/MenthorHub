/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Suscripcion: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Debes iniciar sesión para ver esta página.
      </div>
    );
  }

  const rol = user.role as "alumno" | "profesor";

  const handlePago = async () => {
    try {
      // 1. Crear la orden en el backend
      const response = await axios.post("http://localhost:3001/api/payments/create-paypal-payment", {
        tipoSuscripcion: rol,
      });

      const approvalUrl = response.data?.links?.find(
        (link: any) => link.rel === "approval_url"
      )?.href;

      const orderId = response.data?.id;

      if (!approvalUrl || !orderId) {
        return alert("No se pudo obtener el enlace de PayPal o el ID de la orden.");
      }

      window.open(approvalUrl, "_blank");

     
      const confirmar = window.confirm("¿Confirmar pago de la suscripción?");
      if (confirmar) {
        const captura = await axios.post(
          `http://localhost:3001/api/payments/paypal/capture/${orderId}`
        );

        if (captura.status === 200) {
          alert("¡Pago confirmado exitosamente!");
          navigate("/panel"); 
        } else {
          alert("No se pudo capturar el pago.");
        }
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Hubo un error al procesar el pago.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Suscripción {rol === "alumno" ? "Alumno" : "Profesor"}
        </h1>

        <p className="text-gray-600 text-center mb-6">
          {rol === "alumno"
            ? "Accede a clases ilimitadas, material exclusivo y más."
            : "Crea clases ilimitadas y monetiza tu conocimiento."}
        </p>

        <div className="flex justify-center mb-8">
          <span className="text-4xl font-semibold text-blue-600">$9.99</span>
          <span className="text-gray-500 self-end ml-1">/mes</span>
        </div>

        <button
          onClick={handlePago}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-lg transition duration-200 shadow"
        >
          Pagar con PayPal
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Serás redirigido al entorno seguro de PayPal para completar el pago.
        </p>
      </div>
    </div>
  );
};

export default Suscripcion;

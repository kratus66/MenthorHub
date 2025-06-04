// src/views/PasswordRecovery/ResetPassword.tsx
import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import Background from "../../components/Background/Background";
import MenVir from "../../components/MenVir/MenVir";
import Chatbot from "../../components/Chatbot/Chatbot";

export default function ResetPassword() {
  // —————— Hooks siempre arriba ——————
  const { user } = useUser();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Base URL tal cual en tu Login
  const apiUrl = import.meta.env.VITE_API_URL || "localhost:3001";
  const baseURL = `${window.location.protocol}//${apiUrl}/api`;

  // —————— Efecto para redirigir si ya hay usuario ——————
  useEffect(() => {
    if (user) {
      navigate("/panel");
    }
  }, [user, navigate]);

  // Si el usuario ya existe, no renderizamos nada (la redirección se dispara en el useEffect)
  if (user) {
    return null;
  }

  // —————— Manejo del submit ——————
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await fetch(`${baseURL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message || "Error al restablecer la contraseña.");
      }
    } catch {
      setError("Error de conexión. Intenta más tarde.");
    }
  };

  // —————— Renderizado ——————
  return (
    <div className="w-screen h-screen flex items-center justify-end">
      <div className="w-full h-full flex flex-col justify-start">
        <h1 className="title leading-none pt-[9vh] flex-none">MentorHub</h1>
        <h2 className="subtitle z-10 flex-none">Restablecer contraseña</h2>

        <div className="flex min-w-[90%] h-full w-full overflow-hidden panel-text">
          <div className="flex flex-col justify-between items-center gap-[1.7vh] w-full overflow-auto">
            {success ? (
              <p className="mt-[1.7vh] text-center">
                Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión.
              </p>
            ) : !token ? (
              <p className="mt-[1.7vh] text-center text-red-600">
                Token inválido o no encontrado.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-[1.7vh] w-full"
              >
                <label htmlFor="password" className="text-sm">
                  Nueva contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />

                <label htmlFor="confirmPassword" className="text-sm">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
                >
                  Cambiar contraseña
                </button>
                {error && (
                  <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      <Background>
        <MenVir src="/MenVir_Saludando.webm" />
      </Background>
      <div className="absolute inset-0 flex flex-col items-center justify-center panel"></div>
      <Chatbot />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface RegisterFormProps {
  onSubmit: (formData: FormData) => void;
}

const avatars = [
  { id: 1, emoji: "🧑🏽‍💻" },
  { id: 2, emoji: "🧑🏿‍🎨" },
  { id: 3, emoji: "🧑🏼‍🚀" },
  { id: 4, emoji: "🧑🏿‍🏫" },
];

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [activeTab, setActiveTab] = useState<"personal" | "academics">(
    "personal"
  );

  const [searchParams] = useSearchParams();
  const userInfoParam = searchParams.get("userInfo");
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatarId: 0,
    profileImageFile: null as File | null,
    profileImageUrl: "",
    studies: "",
    role: "",
    country: "",
    province: "",
    location: "",
    isOauth: false,
    oauthProvider: "",
    isConfirmed: false,
  });

  useEffect(() => {
    if (userInfoParam) {
      try {
        const userInfo = JSON.parse(decodeURIComponent(userInfoParam));
        setFormData((prevData) => ({
          ...prevData,
          name: userInfo.name || "",
          email: userInfo.email || "",
          profileImageFile: null,
          profileImageUrl: userInfo.profileImage || "",
          isOauth: true,
          oauthProvider: userInfo.oauthProvider || "",
          isConfirmed: userInfo.isConfirmed || false,
        }));
        console.log("Datos de perfil recibidos:", userInfo);
      } catch (error) {
        console.error("Error al parsear userInfo:", error);
      }
    }
  }, [userInfoParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files) {
      setFormData((prev) => ({
        ...prev,
        profileImageFile: files[0],
        profileImageUrl: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarSelect = (id: number) => {
    setFormData((prev) => ({ ...prev, avatarId: id }));
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s-]/g, "");
    const phoneRegex = /^\+?\d{8,15}$/;
    return phoneRegex.test(cleaned);
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateAcademicFields = (): boolean => {
    const { role } = formData;
    if (!role) {
      alert("Por favor debe seleccionar un Rol.");
      return false;
    }
    return true;
  };
  const validatePersonalFields = (): boolean => {
    const { name, phoneNumber, email, password, confirmPassword } = formData;
    if (
      name.trim() === "" ||
      phoneNumber.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      alert(
        "Por favor, completá todos los campos obligatorios de la Información Personal."
      );
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePersonalFields() || !validateAcademicFields()) return;

    if (!isValidPhone(formData.phoneNumber)) {
      alert(
        "Por favor, ingresá un número de celular válido con código internacional."
      );
      return;
    }
    if (!isValidEmail(formData.email)) {
      alert(
        "Por favor, ingresá un correo de Gmail válido (ej: ejemplo@gmail.com)"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("phoneNumber", formData.phoneNumber.replace(/\s|-/g, ""));
    dataToSend.append("email", formData.email);
    dataToSend.append("password", formData.password);
    dataToSend.append("confirmPassword", formData.confirmPassword); // faltaba
    dataToSend.append("avatarId", formData.avatarId.toString());
    dataToSend.append("studies", formData.studies);
    dataToSend.append("role", formData.role);
    dataToSend.append("country", formData.country);
    dataToSend.append("province", formData.province);
    dataToSend.append("location", formData.location);

    dataToSend.append("isOauth", String(formData.isOauth));
    dataToSend.append("oauthProvider", formData.oauthProvider);
    dataToSend.append("isConfirmed", String(formData.isConfirmed));

    if (formData.profileImageFile) {
      dataToSend.append("profileImage", formData.profileImageFile);
    }

    onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-8 p-5 text-gray-700">
      <div className="flex-1 bg-white bg-opacity-50 p-6 rounded-lg shadow-md max-w-md">
        <div className="flex gap-8 mb-6 border-b border-gray-300 text-sm font-semibold">
          <button
            type="button"
            className={`pb-2 ${
              activeTab === "personal"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            Información Personal
          </button>
          <button
            type="button"
            className={`pb-2 ${
              activeTab === "academics"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("academics")}
          >
            Detalles Académicos
          </button>
        </div>

        {activeTab === "personal" && (
          <div className="flex flex-col gap-4">
            <label>
              Nombre Completo <span className="text-red-600">*</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded px-3 py-2 mt-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Nombre completo"
                required
              />
            </label>
            <label>
              Nº de celular <span className="text-red-600">*</span>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full rounded px-3 py-2 mt-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Nº de celular"
                required
              />
            </label>
            <label>
              E-mail <span className="text-red-600">*</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded px-3 py-2 mt-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="email@example.com"
                required
              />
            </label>
            <label>
              Contraseña <span className="text-red-600">*</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded px-3 py-2 mt-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Contraseña"
                required
              />
            </label>
            <label>
              Confirmar Contraseña <span className="text-red-600">*</span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded px-3 py-2 mt-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Confirmar contraseña"
                required
              />
            </label>
            <p className="text-xs mt-2">* campos obligatorios</p>
          </div>
        )}

        {activeTab === "academics" && (
          <div className="flex flex-col gap-4">
            <label>
              Estudios
              <select
                name="studies"
                value={formData.studies}
                onChange={handleSelectChange}
                required
                className="w-full rounded px-3 py-2 mt-1 border border-gray-300"
              >
                <option value="">Seleccionar</option>
                <option value="primario">Primario</option>
                <option value="secundario">Secundario</option>
                <option value="universitario">Universitario</option>
              </select>
            </label>

            <label>
              Rol
              <select
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
                required
                className="w-full rounded px-3 py-2 mt-1 border border-gray-300"
              >
                <option value="">Seleccionar</option>
                <option value="student">Alumno</option>
                <option value="teacher">Profesor</option>
              </select>
            </label>

            <label>
              País
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full rounded px-3 py-2 mt-1 border border-gray-300"
                placeholder="Ej: Argentina"
              />
            </label>

            <label>
              Provincia
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                className="w-full rounded px-3 py-2 mt-1 border border-gray-300"
                placeholder="Ej: Buenos Aires"
              />
            </label>

            <label>
              Localidad
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full rounded px-3 py-2 mt-1 border border-gray-300"
                placeholder="Ej: Quilmes"
              />
            </label>
          </div>
        )}
      </div>

      <div className="w-[300px] bg-white bg-opacity-50 rounded-lg p-6 flex flex-col items-center justify-between shadow-md">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-600 overflow-hidden">
            {formData.profileImageFile ? (
              <img
                src={URL.createObjectURL(formData.profileImageFile)}
                alt="Profile"
                className="rounded-full w-20 h-20 object-cover"
              />
            ) : formData.profileImageUrl ? (
              <img
                src={formData.profileImageUrl}
                alt="Profile"
                className="rounded-full w-20 h-20 object-cover"
              />
            ) : (
              "👤"
            )}
          </div>

          <label
            htmlFor="profileImage"
            className="bg-blue-600 text-white text-sm px-4 py-1 rounded cursor-pointer hover:bg-blue-700 transition"
          >
            Subir imagen
          </label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>

        <div className="w-full mt-4">
          <p className="text-xs mb-1 font-semibold">Seleccionar Avatar</p>
          <div className="flex gap-1 mt-4 flex-wrap justify-center">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                type="button"
                onClick={() => handleAvatarSelect(avatar.id)}
                className={`text-3xl p-2 rounded-full ${
                  formData.avatarId === avatar.id
                    ? "ring-2 ring-blue-600"
                    : "hover:bg-gray-200"
                }`}
              >
                {avatar.emoji}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="mt-6 bg-blue-600 w-full py-2 rounded-full text-white font-semibold hover:bg-blue-700 transition"
          onClick={() => {
            if (activeTab === "personal") {
              if (validatePersonalFields()) {
                setActiveTab("academics");
              }
            } else {
              handleSubmit(new Event("submit") as unknown as React.FormEvent);
            }
          }}
        >
          {activeTab === "personal" ? "Continuar" : "Registrate"}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;

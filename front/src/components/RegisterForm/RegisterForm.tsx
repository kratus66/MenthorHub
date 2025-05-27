import React, { useState } from "react";

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
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatarId: 0,
    profileImage: null as File | null,
    studies: "",
    role: "",
    country: "",
    province: "",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files) {
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
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
    // const { studies, role, country, province, location } = formData;
    const { role } = formData;
    if (!role ) {
      alert("Por favor debe seleccionar un Rol");
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

    if (formData.profileImage) {
      dataToSend.append("profileImage", formData.profileImage);
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
                <option value="alumno">Alumno</option>
                <option value="profesor">Profesor</option>
                {/* <option value="profesor">Admin</option> */}
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
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-600">
            {formData.profileImage ? (
              <img
                src={URL.createObjectURL(formData.profileImage)}
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
      <div className="flex flex-col items-center mt-6">
  <p className="text-sm text-gray-600 mb-2">¿Preferís registrarte con Google?</p>
  <a
    href="http://localhost:3001/api/auth/google"
    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow"
  >
    <svg
      className="w-5 h-5"
      viewBox="0 0 533.5 544.3"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M533.5 278.4c0-18.7-1.6-37.5-4.9-55.7H272.1v105.6h147.4c-6.3 33.4-25.6 61.7-54.8 80.4v66h88.5c51.6-47.5 80.3-117.5 80.3-196.3z"
      />
      <path
        fill="#34A853"
        d="M272.1 544.3c73.7 0 135.4-24.4 180.5-66.3l-88.5-66c-24.6 16.6-56.2 26.3-92 26.3-70.6 0-130.4-47.8-151.9-112.1h-90v70.3c45.4 89.6 137.2 147.8 242.9 147.8z"
      />
      <path
        fill="#FBBC05"
        d="M120.2 326.2c-10.6-31.7-10.6-65.8 0-97.5v-70.3h-90C3.8 205.6 0 241.6 0 278.4s3.8 72.8 30.2 120.1l90-70.3z"
      />
      <path
        fill="#EA4335"
        d="M272.1 109.3c39.9-.6 77.9 14 107.2 41.3l80.1-80.1C407.5 25.3 343.7 0 272.1 0 166.4 0 74.6 58.2 30.2 147.8l90 70.3C141.7 157.1 201.5 109.3 272.1 109.3z"
      />
    </svg>
    Registrarse con Google
  </a>
</div>

    </form>
    
  );
};

export default RegisterForm;

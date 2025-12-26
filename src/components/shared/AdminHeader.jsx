import { useState, useEffect } from "react";
import {
  RiSearchLine,
  RiUser3Line,
  RiLogoutBoxRLine,
  RiEdit2Line,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCloseLine,
  RiMailLine,
  RiKey2Line,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const HeaderAdmin = () => {
  const [adminName, setAdminName] = useState("Administrador");
  const [adminEmail, setAdminEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [companyPhone, setCompanyPhone] = useState("");
  const [enteredPhone, setEnteredPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const menuItems = [
    { name: "dashboard", path: "/admin/dashboard" },
    { name: "perfil", path: "/admin/profile" },
    { name: "cupon", path: "/admin/cupon" },
    { name: "categorias", path: "/admin/categorias" },
    { name: "terminos", path: "/admin/terminos" },
    { name: "politicas", path: "/admin/politicas" },
  ];

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch(
          "https://apidemo.cartavirtual.shop/api/administrador"
        );
        const data = await res.json();
        if (data && data.nombre) {
          setAdminName(data.nombre);
          setAdminEmail(data.email);
        }
      } catch (err) {
        console.error("Error al obtener administrador:", err);
      }
    };

    const fetchEmpresa = async () => {
      try {
        const res = await fetch(
          "https://apidemo.cartavirtual.shop/api/empresa"
        );
        const data = await res.json();
        if (data && data.telefono) {
          const cleaned = String(data.telefono).replace(/[^0-9+]/g, "");
          setCompanyPhone(cleaned);
        }
      } catch (err) {
        console.error("Error al obtener empresa:", err);
      }
    };

    fetchAdmin();
    fetchEmpresa();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".admin-menu")) setMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  const handleUpdate = () => {
    setMenuOpen(false);
    setShowModal(true);
    setEnteredPhone("");
    setNewPassword("");
    setConfirmPass("");
    setIsCodeVerified(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    const found = menuItems.find((item) => item.name.toLowerCase() === term);
    if (found) {
      window.location.href = found.path;
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "No se encontró la sección",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  // Verificación automática en segundo plano
  useEffect(() => {
    if (enteredPhone.trim() === companyPhone) {
      setIsCodeVerified(true); // Código se genera y verifica automáticamente
    } else {
      setIsCodeVerified(false);
    }
  }, [enteredPhone, companyPhone]);

  const handleSave = async () => {
    if (!isCodeVerified) {
      return Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Verifica el número antes de actualizar",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    if (!adminEmail && !newPassword) {
      return Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Completa los campos",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    if (newPassword && newPassword !== confirmPass) {
      return Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Las contraseñas no coinciden",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    const body = {};
    if (adminEmail) body.email = adminEmail;
    if (newPassword) body.contrasena = newPassword;

    setLoading(true);
    try {
      const res = await fetch(
        "https://apidemo.cartavirtual.shop/api/administrador/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar los datos");
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Datos actualizados correctamente",
        showConfirmButton: false,
        timer: 2000,
      });
      setShowModal(false);
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "No se pudo actualizar",
        showConfirmButton: false,
        timer: 2500,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="flex items-center justify-between bg-white px-8 py-4 border-b border-gray-200 relative">
        <form onSubmit={handleSearch} className="relative w-1/3">
        </form>

        <div
          className="flex items-center gap-2 cursor-pointer px-3 py-1 admin-menu select-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <RiUser3Line className="text-2xl text-gray-700" />
          <span className="text-gray-700 font-medium">{adminName}</span>
          {menuOpen ? (
            <RiArrowUpSLine className="text-xl text-gray-500" />
          ) : (
            <RiArrowDownSLine className="text-xl text-gray-500" />
          )}

          {menuOpen && (
            <div className="absolute right-8 top-16 bg-white border border-gray-200 rounded-lg shadow-lg w-56 z-50">
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 w-full px-4 py-2 text-gray-700"
              >
                <RiEdit2Line /> Actualizar datos
              </button>
              <hr className="border-gray-200" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-red-600"
              >
                <RiLogoutBoxRLine /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MODAL A LA DERECHA */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
          <div className="bg-white w-1/4 h-full shadow-2xl p-6 relative flex flex-col">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <RiCloseLine className="text-2xl" />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Actualizar datos
            </h2>

            <div className="flex-1 overflow-y-auto pb-20">
              {/* INPUT NUMERO */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-1 text-sm">
                  Ingresa tu número de WhatsApp
                </label>
                <input
                  type="text"
                  value={enteredPhone}
                  onChange={(e) => setEnteredPhone(e.target.value)}
                  placeholder="Ej: +51987654321"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* EMAIL */}
              <div className="mb-3">
                <label className="block text-gray-700 mb-1 text-sm">
                  Nuevo correo
                </label>
                <div className="relative">
                  <RiMailLine className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    disabled={!isCodeVerified}
                    className={`w-full border border-gray-300 rounded-lg px-10 py-2 ${
                      !isCodeVerified ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    placeholder="Ingresa el nuevo correo"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label className="block text-gray-700 mb-1 text-sm">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <RiKey2Line className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={!isCodeVerified}
                    className={`w-full border border-gray-300 rounded-lg px-10 py-2 ${
                      !isCodeVerified ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    placeholder="Ingresa la nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="mb-5">
                <label className="block text-gray-700 mb-1 text-sm">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <RiKey2Line className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    disabled={!isCodeVerified}
                    className={`w-full border border-gray-300 rounded-lg px-10 py-2 ${
                      !isCodeVerified ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    placeholder="Repite la contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {showConfirm ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={!isCodeVerified || loading}
                className={`w-full py-2 rounded-lg text-white ${
                  isCodeVerified
                    ? "bg-[#F0320C] hover:bg-[#F0320C]"
                    : "bg-[#F0320C] cursor-not-allowed"
                }`}
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderAdmin;

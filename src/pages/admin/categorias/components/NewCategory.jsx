import React, { useEffect, useState } from "react";
import { X } from "lucide-react"; // ⬅️ Icono más estilizado
import CategoryForm from "./CategoryForm";

const RightModal = ({ isOpen, onClose, onSubmit, initialData, refreshCategories }) => {
  const [isTransparent, setIsTransparent] = useState(false);

  // 🧩 Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // 🧩 Verificar si la imagen tiene fondo transparente
  useEffect(() => {
    if (initialData?.imagen) {
      const img = new Image();
      img.src = initialData.imagen;
      img.onload = () => {
        // Crear un canvas temporal para analizar transparencia
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pixels = ctx.getImageData(0, 0, img.width, img.height).data;

        // Revisar si hay píxeles con alpha < 255
        let hasTransparency = false;
        for (let i = 3; i < pixels.length; i += 4) {
          if (pixels[i] < 255) {
            hasTransparency = true;
            break;
          }
        }
        setIsTransparent(hasTransparency);
      };
    } else {
      setIsTransparent(false);
    }
  }, [initialData]);

  if (!isOpen) return null;
  const isEditMode = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Fondo oscuro borroso */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Contenedor lateral */}
      <div className="relative ml-auto w-full sm:w-2/5 h-full bg-white shadow-2xl p-6 animate-slideIn overflow-y-auto">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
            title="Cerrar"
          >
            <X size={26} strokeWidth={2.5} />
          </button>
        </div>

        {/* Imagen de categoría */}
        {initialData?.imagen && (
          <div
            className={`flex justify-center items-center mb-5 rounded-xl overflow-hidden border shadow-sm ${
              isTransparent ? "bg-white" : "bg-transparent"
            }`}
          >
            <img
              src={initialData.imagen}
              alt="Vista previa"
              className="max-h-[300px] w-auto object-contain"
            />
          </div>
        )}

        {/* Formulario de categoría */}
        <CategoryForm
          initialData={initialData}
          onCancel={onClose}
          onSuccess={(data) => {
            if (onSubmit) onSubmit(data);
            if (refreshCategories) refreshCategories();
            onClose();
          }}
        />
      </div>

      {/* Animación */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RightModal;

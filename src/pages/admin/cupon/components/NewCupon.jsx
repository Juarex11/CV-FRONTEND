import React from "react";
import ProductoForm from "./CuponForm";

const RightModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Fondo borroso */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Contenedor lateral derecho */}
      <div className="relative ml-auto w-1/3 h-full bg-white shadow-2xl p-6 animate-slideIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? "Editar Cupón" : "Nuevo Cupón"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <ProductoForm
          initialData={initialData}
          onCancel={onClose}
          onSuccess={onSuccess} 
        />
      </div>
    </div>
  );
};

export default RightModal;

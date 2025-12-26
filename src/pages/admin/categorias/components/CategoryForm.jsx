import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { RiImageAddLine } from "react-icons/ri";

const CategoryForm = ({ initialData = null, onCancel, onSuccess }) => {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageFile: null,
    previewUrl: null,
  });

  const [loading, setLoading] = useState(false);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        imageFile: null,
        previewUrl: initialData.imageUrl || null,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        imageFile: null,
        previewUrl: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile" && files.length > 0) {
      const file = files[0];
      setFormData({
        ...formData,
        imageFile: file,
        previewUrl: URL.createObjectURL(file),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("nombre", formData.name);
      form.append("descripcion", formData.description);
      form.append("estado", 1); // obligatorio siempre 1

      if (formData.imageFile) form.append("imagen", formData.imageFile);

      let url = "https://apidemo.cartavirtual.shop/api/categorias";
      let method = "POST";

      if (isEditMode) {
        url = `${url}/${initialData.id_categoria}`;
        form.append("_method", "PUT");
      }

      const response = await fetch(url, {
        method,
        body: form,
        headers: {
          Accept: "application/json",
        },
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        swal(
          "Error",
          "El servidor no devolvió JSON. Revisa la URL, método o autenticación.",
          "error"
        );
        setLoading(false);
        return;
      }

      if (!response.ok) {
        swal(
          "Error",
          data.message || "Ocurrió un error al guardar la categoría",
          "error"
        );
        return;
      }

      swal(
        "Éxito",
        isEditMode
          ? "Categoría actualizada correctamente"
          : "Categoría creada correctamente",
        "success"
      );

      // Resetear formulario si era creación
      if (!isEditMode) {
        setFormData({
          name: "",
          description: "",
          imageFile: null,
          previewUrl: null,
        });
      }

      if (onSuccess) onSuccess(data);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      swal(
        "Error de conexión",
        `No se pudo conectar con el servidor: ${error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {/* 🏷 Nombre */}
        <label className="block">
          <span className="text-gray-700 font-medium">Nombre</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
            required
          />
        </label>

        {/* 📝 Descripción */}
        <label className="block">
          <span className="text-gray-700 font-medium">Descripción</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
            required
          />
        </label>

        {/* 🖼 Imagen */}
        <div>
          <span className="text-gray-700 font-medium">Imagen</span>

          {/* Botón personalizado */}
          <div className="mt-2 flex items-center space-x-3">
            <label
              htmlFor="imageFile"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition-all cursor-pointer"
            >
              <RiImageAddLine size={18} className="mr-2" />
              Seleccionar archivo
            </label>
            <input
              id="imageFile"
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
            {formData.imageFile && (
              <span className="text-gray-600 text-sm truncate max-w-[150px]">
                {formData.imageFile.name}
              </span>
            )}
          </div>

          {/* Vista previa grande */}
          {formData.previewUrl && (
            <img
              src={formData.previewUrl}
              alt="Preview"
              className="mt-4 w-full h-[260px] object-contain rounded-xl border shadow-sm bg-white"
            />
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="border-t pt-4 mt-4 flex justify-end space-x-3 bg-white sticky bottom-0">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow"
          disabled={loading}
        >
          {loading ? "Guardando..." : isEditMode ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;

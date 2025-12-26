import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import swal from "sweetalert";
import { FaSave } from "react-icons/fa";

const TerminosComponent = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchTerminos = async () => {
      try {
        const res = await fetch("https://apidemo.cartavirtual.shop/api/terminos");
        if (!res.ok) throw new Error("Error al obtener datos de términos");
        const data = await res.json();
        setTitulo(data?.titulo ?? "");
        setDescripcion(data?.descripcion ?? "");
      } catch (error) {
        swal("Error", "No se pudo cargar los términos", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchTerminos();
  }, []);

  const handleGuardar = async () => {
    try {
      const payload = { titulo, descripcion };
      console.log("Guardando:", payload);

      const res = await fetch("https://apidemo.cartavirtual.shop/api/terminos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al guardar los cambios");

      swal("Éxito", "Términos actualizados correctamente", "success");
    } catch (error) {
      swal("Error", error.message, "error");
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["clean"],
    ],
  };

  if (loading || !mounted)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Cargando editor...
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      {/* Contenedor principal */}
      <div className="bg-white p-6 rounded-xl shadow-md overflow-hidden">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título de los términos"
            className="border rounded-lg px-4 py-2 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Editor con padding inferior */}
          <div className="border rounded-lg overflow-hidden">
            <ReactQuill
              theme="snow"
              value={descripcion}
              onChange={setDescripcion}
              modules={modules}
              className="h-[700px] bg-white"
            />
          </div>
        </div>
      </div>

      {/* Botón fuera del recuadro */}
      <div className="flex justify-center mt-2">
        <button
          onClick={handleGuardar}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-medium shadow-md"
        >
          <FaSave className="text-xl" />
          Guardar
        </button>
      </div>

      {/* Estilo adicional */}
      <style jsx global>{`
        .ql-editor {
          padding-bottom: 100px !important;
        }
      `}</style>
    </div>
  );
};

export default TerminosComponent;

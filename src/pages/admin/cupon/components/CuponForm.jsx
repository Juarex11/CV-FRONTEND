import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const CuponForm = ({ initialData = null, onCancel, onSuccess }) => {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    codigo: "",
    tipo: "porcentaje",
    valor: "",
    id_categoria: "",
    id_producto: "",
    fecha_inicio: "",
    fecha_fin: "",
    cantidad_total: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [allProductos, setAllProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  // errores por input
  const [errors, setErrors] = useState({});

  // verificación del código existente
  const [verificando, setVerificando] = useState(false);
  const [codigoValido, setCodigoValido] = useState(null);

  // cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        codigo: initialData.codigo || "",
        tipo: initialData.tipo || "porcentaje",
        valor: initialData.valor || "",
        id_categoria: initialData.id_categoria || "",
        id_producto: initialData.id_producto || "",
        fecha_inicio: initialData.fecha_inicio
          ? initialData.fecha_inicio.split("T")[0]
          : "",
        fecha_fin: initialData.fecha_fin
          ? initialData.fecha_fin.split("T")[0]
          : "",
        cantidad_total: initialData.cantidad_total || "",
      });
      setCodigoValido(true);
    }
  }, [initialData]);

  // cargar categorías y productos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCat, resProd] = await Promise.all([
          fetch("https://apidemo.cartavirtual.shop/api/categorias"),
          fetch("https://apidemo.cartavirtual.shop/api/producto"),
        ]);

        const catData = await resCat.json();
        const prodData = await resProd.json();

        setCategorias(catData || []);
        setProductos(prodData || []);
        setAllProductos(prodData || []);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchData();
  }, []);

  // verificación de código
  useEffect(() => {
    if (!formData.codigo.trim()) {
      setCodigoValido(null);
      return;
    }

    const delay = setTimeout(async () => {
      setVerificando(true);

      try {
        const res = await fetch("https://apidemo.cartavirtual.shop/api/cupon");
        const data = await res.json();

        const existe = data.some(
          (c) =>
            c.codigo?.toLowerCase() === formData.codigo.toLowerCase() &&
            (!isEditMode || c.id_cupon !== initialData?.id_cupon)
        );

        setCodigoValido(!existe);
      } catch (error) {
        console.error("Error verificando código:", error);
        setCodigoValido(null);
      } finally {
        setVerificando(false);
      }
    }, 600);

    return () => clearTimeout(delay);
  }, [formData.codigo]);

  // manejar cambios
  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors({ ...errors, [name]: null });

    if (name === "id_categoria") {
      if (value === "") {
        setProductos(allProductos);
      } else {
        const filtrados = allProductos.filter(
          (p) => String(p.id_categoria) === String(value)
        );
        setProductos(filtrados);
      }

      setFormData({ ...formData, [name]: value, id_producto: "" });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // cambiar tipo
  const toggleTipo = () => {
    setFormData({
      ...formData,
      tipo: formData.tipo === "porcentaje" ? "monto" : "porcentaje",
      valor: "",
    });
  };

  // validar campos
  const validate = () => {
    let newErrors = {};

    if (!formData.codigo.trim()) newErrors.codigo = "El código es obligatorio";
    if (!formData.valor) newErrors.valor = "El valor es obligatorio";
    if (formData.tipo === "porcentaje" && Number(formData.valor) > 100)
      newErrors.valor = "El porcentaje no puede superar 100";

    if (!formData.fecha_inicio)
      newErrors.fecha_inicio = "La fecha de inicio es obligatoria";

    if (!formData.fecha_fin)
      newErrors.fecha_fin = "La fecha de fin es obligatoria";

    if (!formData.cantidad_total)
      newErrors.cantidad_total = "La cantidad total es obligatoria";

    if (!isEditMode && codigoValido === false)
      newErrors.codigo = "El código ya existe";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        codigo: formData.codigo,
        tipo: formData.tipo,
        valor: formData.valor,
        id_categoria: formData.id_categoria || null,
        id_producto: formData.id_producto || null,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        estado: true,
        cantidad_total: formData.cantidad_total,
      };

      const urlBase = "https://apidemo.cartavirtual.shop/api/cupon";
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode ? `${urlBase}/${initialData.id_cupon}` : urlBase;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error:", data);
        return;
      }

      swal(
        "Éxito",
        isEditMode ? "Cupón actualizado correctamente" : "Cupón creado correctamente",
        "success"
      );

      if (onSuccess) onSuccess(data);
      if (onCancel) onCancel();
    } catch (error) {
      console.error("Error en servidor:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">

      {/* Contenedor scroll */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-20">

        {/* Código */}
        <div>
          <span className="text-gray-700 font-semibold">Código</span>

          <div className="flex items-center space-x-2 mt-1">
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 ${
                errors.codigo ? "border-red-500" : ""
              } ${
                codigoValido === false && !errors.codigo
                  ? "border-red-500"
                  : codigoValido === true
                  ? "border-green-500"
                  : ""
              }`}
            />

            {verificando ? (
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            ) : codigoValido === true ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : codigoValido === false ? (
              <XCircle className="w-5 h-5 text-red-500" />
            ) : null}
          </div>

          {errors.codigo && (
            <p className="text-red-600 text-sm mt-1">{errors.codigo}</p>
          )}
        </div>

        {/* Tipo */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-gray-700 font-semibold">
            Tipo: {formData.tipo === "porcentaje" ? "Porcentaje" : "Monto"}
          </span>

          <button
            type="button"
            onClick={toggleTipo}
            className={`relative inline-flex items-center h-6 rounded-full w-14 transition-colors ${
              formData.tipo === "porcentaje" ? "bg-blue-500" : "bg-green-500"
            }`}
          >
            <span
              className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform ${
                formData.tipo === "porcentaje" ? "translate-x-0" : "translate-x-8"
              }`}
            />
          </button>
        </div>

        {/* Valor */}
        <div>
          <span className="text-gray-700 font-semibold">
            Valor {formData.tipo === "porcentaje" ? "(%)" : "(S/)"}
          </span>

          <input
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            className={`mt-1 w-full border rounded-lg p-2 ${
              errors.valor ? "border-red-500" : ""
            }`}
          />

          {errors.valor && (
            <p className="text-red-600 text-sm mt-1">{errors.valor}</p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <span className="text-gray-700 font-semibold">Categoría (opcional)</span>

          <select
            name="id_categoria"
            value={formData.id_categoria || ""}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2"
          >
            <option value="">Sin categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Producto */}
        <div>
          <span className="text-gray-700 font-semibold">Producto (opcional)</span>

          <select
            name="id_producto"
            value={formData.id_producto || ""}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2"
          >
            <option value="">Sin producto</option>
            {productos.map((prod) => (
              <option key={prod.id_producto} value={prod.id_producto}>
                {prod.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-700 font-semibold">Fecha inicio</span>

            <input
              type="date"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              className={`mt-1 w-full border rounded-lg p-2 ${
                errors.fecha_inicio ? "border-red-500" : ""
              }`}
            />

            {errors.fecha_inicio && (
              <p className="text-red-600 text-sm mt-1">{errors.fecha_inicio}</p>
            )}
          </div>

          <div>
            <span className="text-gray-700 font-semibold">Fecha fin</span>

            <input
              type="date"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              className={`mt-1 w-full border rounded-lg p-2 ${
                errors.fecha_fin ? "border-red-500" : ""
              }`}
            />

            {errors.fecha_fin && (
              <p className="text-red-600 text-sm mt-1">{errors.fecha_fin}</p>
            )}
          </div>
        </div>

        {/* Cantidad total */}
        <div>
          <span className="text-gray-700 font-semibold">Cantidad total</span>

          <input
            type="number"
            name="cantidad_total"
            value={formData.cantidad_total}
            onChange={handleChange}
            className={`mt-1 w-full border rounded-lg p-2 ${
              errors.cantidad_total ? "border-red-500" : ""
            }`}
          />

          {errors.cantidad_total && (
            <p className="text-red-600 text-sm mt-1">
              {errors.cantidad_total}
            </p>
          )}
        </div>
      </div>

      {/* Botones más arriba */}
      <div className="border-t py-3 flex justify-end gap-3 bg-white sticky bottom-0 z-20">
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
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
          disabled={loading}
        >
          {loading ? "Guardando..." : isEditMode ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default CuponForm;

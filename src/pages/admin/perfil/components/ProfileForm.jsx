import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import swal from "sweetalert";

// Ícono estilo Google
const markerIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Marker con arrastre y click
const LocationMarker = ({ position, setPosition, setAddress, setSearch }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&addressdetails=1`
        );
        const data = await res.json();
        const display = data.display_name || "Ubicación desconocida";
        setAddress(display);
        setSearch(display);
      } catch {
        setAddress("No se pudo obtener la dirección");
        setSearch("");
      }
    };
    fetchAddress();
  }, [position, setAddress, setSearch]);

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const newPos = e.target.getLatLng();
          setPosition(newPos);
        },
      }}
      icon={markerIcon}
    />
  );
};

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    horario: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
  });

  const [position, setPosition] = useState({ lat: -12.0464, lng: -77.0428 });
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");
  const [videoEnabled, setVideoEnabled] = useState(false);

  // --- Cargar datos desde API ---
  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const res = await fetch("https://apidemo.cartavirtual.shop/api/empresa");
        const data = await res.json();
        setFormData({
          nombre: data.nombre || "",
          telefono: data.telefono || "",
          horario: data.horario || "",
          facebook: data.facebook_url || "",
          instagram: data.instagram_url || "",
          tiktok: data.tiktok_url || "",
          youtube: data.video_pres_url || "",
        });
        setVideoEnabled(!!data.video_pres_url);

        // Intentar geocodificar ubicación
        if (data.ubicacion) {
          const geo = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              data.ubicacion
            )}`
          );
          const geoData = await geo.json();
          if (geoData.length > 0) {
            setPosition({
              lat: parseFloat(geoData[0].lat),
              lng: parseFloat(geoData[0].lon),
            });
            setAddress(geoData[0].display_name);
            setSearch(geoData[0].display_name);
          } else {
            setAddress(data.ubicacion);
            setSearch(data.ubicacion);
          }
        }
      } catch (err) {
        console.error(err);
        swal("Error", "No se pudieron cargar los datos de la empresa", "error");
      }
    };
    fetchEmpresa();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      if (data.length > 0) {
        setPosition({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
        setAddress(data[0].display_name);
        setSearch(data[0].display_name);
      } else {
        swal("No se encontró la dirección");
      }
    } catch {
      swal("Error al buscar dirección");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: formData.nombre,
        telefono: formData.telefono,
        horario: formData.horario,
        facebook_url: formData.facebook,
        instagram_url: formData.instagram,
        tiktok_url: formData.tiktok,
        video_pres_url: videoEnabled ? formData.youtube : "",
        ubicacion: address,
        lat: position.lat,
        lng: position.lng,
      };

      const res = await fetch("https://apidemo.cartavirtual.shop/api/empresa/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al guardar los datos");
      }

      swal("Éxito", "Datos de la empresa actualizados correctamente", "success");
    } catch (err) {
      console.error(err);
      swal("Error", err.message, "error");
    }
  };

  // Convertir YouTube a embed
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2] ? `https://www.youtube.com/embed/${match[2]}` : "";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-6">
      <div className="flex gap-8">
        {/* Formulario */}
        <div className="w-1/2 flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-semibold">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Horario de atención
            </label>
            <input
              type="text"
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Dirección actual
            </label>
            <textarea
              readOnly
              value={address}
              className="w-full border px-3 py-2 rounded-lg mt-1 bg-gray-100 h-20 resize-none text-sm"
            />
          </div>
        </div>

        {/* Mapa */}
        <div className="flex-1 flex flex-col gap-2">
          <form onSubmit={handleSearch} className="flex w-full mb-3 items-center gap-2">
            <label className="text-gray-700 font-semibold">Buscar:</label>
            <input
              type="text"
              placeholder="Ingrese dirección..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Buscar
            </button>
          </form>

          <div className="w-full rounded-lg overflow-hidden shadow-md border">
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom
              className="h-[400px] w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
              />
              <LocationMarker
                position={position}
                setPosition={setPosition}
                setAddress={setAddress}
                setSearch={setSearch}
              />
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Redes sociales */}
      <div>
        <h2 className="font-semibold text-gray-700 mb-2">Redes Sociales</h2>
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-2 border rounded-lg px-3 py-2">
            <FaFacebookF className="text-blue-600" />
            <input
              type="text"
              placeholder="Facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              className="flex-1 border-none outline-none"
            />
          </div>

          <div className="flex-1 flex items-center gap-2 border rounded-lg px-3 py-2">
            <FaTiktok className="text-black" />
            <input
              type="text"
              placeholder="TikTok"
              name="tiktok"
              value={formData.tiktok}
              onChange={handleChange}
              className="flex-1 border-none outline-none"
            />
          </div>

          <div className="flex-1 flex items-center gap-2 border rounded-lg px-3 py-2">
            <FaInstagram className="text-pink-500" />
            <input
              type="text"
              placeholder="Instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="flex-1 border-none outline-none"
            />
          </div>
        </div>
      </div>

      {/* Video YouTube */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-gray-700">Video de YouTube</h2>

            {/* 🔘 Palanca ON/OFF (negro ↔ verde) */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={videoEnabled}
                onChange={() => setVideoEnabled(!videoEnabled)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-black rounded-full peer transition-colors duration-300 peer-checked:bg-green-500"></div>
              <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>

        {/* Si está activa la palanca, muestra input + vista previa */}
        {videoEnabled && (
          <>
            <input
              type="text"
              placeholder="Ingrese link de YouTube"
              name="youtube"
              value={formData.youtube}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg mb-2"
            />

            {getYouTubeEmbedUrl(formData.youtube) && (
              <div className="w-full h-[480px]">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={getYouTubeEmbedUrl(formData.youtube)}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </>
        )}
      </div>

      {/* Guardar */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;

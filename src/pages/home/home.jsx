/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowUp, FaCartPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Sidebar from "../../components/shared/Sidebar";
import Car from "../../components/shared/Car1";
import Header from "../../components/shared/Header";
import Card from "../../components/shared/Card";
import DiscountToast from "../../components/cupon_web";

// ---------- HOME ----------
const Home = ({ addToCart, cart, setCart }) => {
  const navigate = useNavigate();

  const [showOrder, setShowOrder] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const [bannerUrl, setBannerUrl] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const categoryRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Normalizar URL YouTube
  const formatYouTubeUrl = (url) => {
    if (!url) return null;
    if (url.includes("embed")) return url;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`;
    return url;
  };

  const slides = [];
  if (bannerUrl) slides.push({ type: "image", src: bannerUrl });
  if (videoUrl) slides.push({ type: "video", src: formatYouTubeUrl(videoUrl) });

  const handleMobileScroll = () => {
    const el = sliderRef.current;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setCurrentIndex(index);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Scroll top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch productos
  useEffect(() => {
    fetch("https://apidemo.cartavirtual.shop/api/producto")
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  // Fetch categorias
  useEffect(() => {
    fetch("https://apidemo.cartavirtual.shop/api/categorias")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  // Recursos empresa
  useEffect(() => {
    fetch("https://apidemo.cartavirtual.shop/api/recursos-empresa")
      .then((r) => r.json())
      .then((data) => {
        if (data.portada_url)
          setBannerUrl(`https://apidemo.cartavirtual.shop/${data.portada_url}`);
        if (data.logo_url)
          setLogoUrl(`https://apidemo.cartavirtual.shop/${data.logo_url}`);
      });
  }, []);

  // Datos empresa
  useEffect(() => {
    fetch("https://apidemo.cartavirtual.shop/api/empresa")
      .then((r) => r.json())
      .then((data) => {
        setEmpresaNombre(data.nombre);
        setVideoUrl(data.video_pres_url);
      });
  }, []);

  // Favicon y title
  useEffect(() => {
    if (empresaNombre) document.title = `${empresaNombre} / Home`;
    if (logoUrl) {
      const f = document.querySelector("link[rel='icon']") || document.createElement("link");
      f.rel = "icon";
      f.href = logoUrl;
      document.head.appendChild(f);
    }
  }, [empresaNombre, logoUrl]);

  // DETECTAR SCROLL HORIZONTAL CATEGORÍAS
  useEffect(() => {
    const container = categoryRef.current;
    if (!container) return;

    const checkScroll = () => {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(container.scrollLeft + container.clientWidth < container.scrollWidth);
    };

    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    checkScroll();

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  const scrollCategory = (direction) => {
    const container = categoryRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth / 2;
    container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  const filteredProducts = products.filter((p) =>
    searchTerm.trim()
      ? p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      : selectedCategory === "Todos" || p.id_categoria === selectedCategory
  );

  return (
    <>
      <DiscountToast />
      <div
        className={`w-full min-h-screen transition-colors duration-300 ${
          darkMode ? "bg-[#262837] text-white" : "bg-white text-gray-900"
        }`}
      >
        <Sidebar showMenu={false} darkMode={darkMode} />
        <Car showOrder={showOrder} setShowOrder={setShowOrder} darkMode={darkMode} cart={cart} setCart={setCart} />

        {/* BOTÓN CARRITO FLOTANTE */}
        {!showOrder && (
          <button
            onClick={() => setShowOrder(true)}
            className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-[#1F1F1F] rounded-full md:hidden flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
          >
            <FaCartPlus className="w-7 h-7" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-[#1F1F1F] text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                {cart.length}
              </span>
            )}
          </button>
        )}

        {/* SCROLL TOP BOTÓN MÓVIL */}
        {showScrollTop && !showOrder && (
          <button
            onClick={scrollToTop}
            className="fixed right-4 bottom-20 z-50 w-12 h-12 bg-[#1F1F1F] rounded-full flex items-center justify-center text-white shadow-lg transition-opacity duration-300 hover:scale-110 md:hidden"
          >
            <FaArrowUp />
          </button>
        )}

        <main className="lg:pl-32 lg:pr-96 pb-20">
          <div className="md:p-8 p-4">
            {!showOrder && (
              <Header
                darkMode={darkMode}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onSearch={setSearchTerm}
              />
            )}

            {/* CARRUSEL */}
            {selectedCategory === "Todos" &&
              searchTerm.trim() === "" &&
              slides.length > 0 && (
                <div className="w-full mb-6 mt-4">
                  {/* MOBILE */}
                  <div
                    ref={sliderRef}
                    onScroll={handleMobileScroll}
                    className="block md:hidden w-full overflow-x-auto whitespace-nowrap scroll-smooth snap-x snap-mandatory"
                  >
                    {slides.map((slide, index) => (
                      <div key={index} className="inline-block snap-center w-full" style={{ width: "100%" }}>
                        {slide.type === "image" ? (
                          <img src={slide.src} className="w-full rounded-lg shadow-md object-contain" style={{ height: "auto" }} />
                        ) : (
                          <iframe src={slide.src} className="rounded-lg shadow-md w-full" style={{ aspectRatio: "16/9" }} allowFullScreen />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* MOBILE DOTS */}
                  <div className="flex md:hidden justify-center mt-2 gap-2">
                    {slides.map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${i === currentIndex ? "bg-[#F0320C]" : "bg-gray-400"}`}
                      ></div>
                    ))}
                  </div>

                  {/* DESKTOP */}
                  <div className="hidden md:block relative w-full">
                    {slides.length > 1 && (
                      <button
                        onClick={() => setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white text-3xl"
                      >
                        <FaChevronLeft />
                      </button>
                    )}
                    {slides[currentIndex].type === "image" ? (
                      <img src={slides[currentIndex].src} className="w-full rounded-lg shadow-md object-contain" style={{ height: "auto" }} />
                    ) : (
                      <iframe src={slides[currentIndex].src} className="rounded-lg shadow-md w-full" style={{ aspectRatio: "16/9" }} allowFullScreen />
                    )}
                    {slides.length > 1 && (
                      <button
                        onClick={() => setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white text-3xl"
                      >
                        <FaChevronRight />
                      </button>
                    )}
                  </div>
                </div>
              )}

            {/* TÍTULO CATEGORÍAS
            {categories.length > 0 && !showOrder && (
              <div className="mb-2 mt-6">
                <h2 className="text-2xl font-bold text-[#000000] dark:text-[#000000] px-2">NUESTROS PRODUCTOS</h2>
              </div>
            )}*/}

            {/* CATEGORÍAS */}
            {categories.length > 0 && !showOrder && (
              <div className="relative mb-6">
                {/* FLECHAS desktop */}
                <div className="hidden md:flex absolute right-2 -bottom-6 z-20 gap-2">
  <button
    onClick={() => scrollCategory("left")}
    className="w-8 h-8 rounded-full border border-black bg-transparent flex items-center justify-center shadow-sm"
  >
    <FaChevronLeft className="text-black text-sm" />
  </button>

  <button
    onClick={() => scrollCategory("right")}
    className="w-8 h-8 rounded-full border border-black bg-transparent flex items-center justify-center shadow-sm"
  >
    <FaChevronRight className="text-black text-sm" />
  </button>
</div>

                <nav
                  ref={categoryRef}
                  className="flex overflow-x-auto md:overflow-hidden whitespace-nowrap items-center gap-4 py-2 px-2 md:px-0 scrollbar-hide pb-6"
                >
                  <button
                    onClick={() => setSelectedCategory("Todos")}
                    className={`relative flex items-center gap-3 md:gap-2 py-3 md:py-2 px-4 md:px-6 rounded-full transition-all duration-300 flex-shrink-0 border text-lg md:text-base font-semibold shadow-md ${
                      selectedCategory === "Todos"
                        ? "bg-[#F0580C] text-white border-none"
                        : "bg-transparent text-gray-700 border border-gray-400"
                    }`}
                  >
                    {selectedCategory === "Todos" && (
                      <div className="w-12 h-12 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <img src="/elementos.gif" alt="fire" className="w-8 h-8 md:w-5 md:h-5" />
                      </div>
                    )}
                    Todos
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id_categoria}
                      onClick={() => setSelectedCategory(cat.id_categoria)}
                      className={`relative flex items-center gap-3 md:gap-2 py-3 md:py-2 px-4 md:px-6 rounded-full transition-all duration-300 flex-shrink-0 border text-lg md:text-base font-semibold shadow-md ${
                        selectedCategory === cat.id_categoria
                          ? "bg-[#F0580C] text-white border-none"
                          : "bg-transparent text-gray-700 border border-gray-400"
                      }`}
                    >
                      {selectedCategory === cat.id_categoria && (
                        <div className="w-12 h-12 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                          <img src="/elementos.gif" alt="fire" className="w-8 h-8 md:w-5 md:h-5" />
                        </div>
                      )}
                      {cat.nombre}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* PRODUCTOS */}
            <Card
              darkMode={darkMode}
              products={filteredProducts}
              addToCart={addToCart}
              selectedCategory={selectedCategory}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ChevronRight, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getProducts, getCategories } from "../utils/api";
import type { Product, Category } from "../utils/api";
import { useSiteConfig } from "../utils/useSiteConfig";

const heroImg = "https://images.unsplash.com/photo-1767739791246-9f832345f8f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbWV0YWwlMjBwYXJ0cyUyMG1hY2hpbmVyeSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3Nzc0NzE1NTl8MA&ixlib=rb-4.1.0&q=80&w=1080";

const fallbackProducts = [
  { id: 1, name: "灰铸铁机床底座", category: { id: 1, name: "灰铸铁", sort_order: 1, product_count: 0 }, material: "HT200 / HT300", weight_range: "50-5000 kg", standard: "GB/T 9439", cover_image: "https://images.unsplash.com/photo-1763669029286-7f1662eb921d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhbCUyMGNhc3RpbmclMjBmb3VuZHJ5JTIwaW5kdXN0cmlhbCUyMGZhY3Rvcnl8ZW58MXx8fHwxNzc3NDcxNTU5fDA&ixlib=rb-4.1.0&q=80&w=600", images: [], tag: "热销", is_featured: true, sort_order: 1, created_at: "" },
  { id: 2, name: "球墨铸铁曲轴", category: { id: 2, name: "球墨铸铁", sort_order: 2, product_count: 0 }, material: "QT500-7 / QT600-3", weight_range: "5-500 kg", standard: "GB/T 1348", cover_image: "https://images.unsplash.com/photo-1682834187151-682c7420e88b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMGNhc3RpbmclMjBtb2x0ZW4lMjBtZXRhbCUyMG1hbnVmYWN0dXJpbmd8ZW58MXx8fHwxNzc3NDcxNTU5fDA&ixlib=rb-4.1.0&q=80&w=600", images: [], tag: "精品", is_featured: true, sort_order: 2, created_at: "" },
  { id: 3, name: "铸钢减速机壳体", category: { id: 3, name: "铸钢件", sort_order: 3, product_count: 0 }, material: "ZG230-450 / ZG340-640", weight_range: "10-2000 kg", standard: "GB/T 11352", cover_image: "https://images.unsplash.com/photo-1767739791246-9f832345f8f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbWV0YWwlMjBwYXJ0cyUyMG1hY2hpbmVyeSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3Nzc0NzE1NTl8MA&ixlib=rb-4.1.0&q=80&w=600", images: [], tag: "", is_featured: false, sort_order: 3, created_at: "" },
  { id: 4, name: "铝合金泵体铸件", category: { id: 4, name: "铝合金", sort_order: 4, product_count: 0 }, material: "A356 / ZL101A", weight_range: "0.5-50 kg", standard: "GB/T 1173", cover_image: "https://images.unsplash.com/photo-1748640857973-93524ef0fe7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVjaXNpb24lMjBlbmdpbmVlcmluZyUyMHdvcmtzaG9wJTIwQ05DJTIwbWFjaGluaW5nfGVufDF8fHx8MTc3NzQ3MTU2MHww&ixlib=rb-4.1.0&q=80&w=600", images: [], tag: "新品", is_featured: true, sort_order: 4, created_at: "" },
  { id: 5, name: "精密铸造涡轮叶片", category: { id: 5, name: "精密铸造", sort_order: 5, product_count: 0 }, material: "IN718 / 304 不锈钢", weight_range: "0.1-20 kg", standard: "ASTM A352", cover_image: "https://images.unsplash.com/photo-1764185800646-f75f7e16e465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWN0b3J5JTIwcHJvZHVjdGlvbiUyMGxpbmUlMjBtYW51ZmFjdHVyaW5nJTIwcGxhbnR8ZW58MXx8fHwxNzc3NDcxNTYwfDA&ixlib=rb-4.1.0&q=80&w=600", images: [], tag: "", is_featured: false, sort_order: 5, created_at: "" },
  { id: 6, name: "灰铸铁制动鼓", category: { id: 1, name: "灰铸铁", sort_order: 1, product_count: 0 }, material: "HT250", weight_range: "3-30 kg", standard: "GB/T 9439", cover_image: "https://images.unsplash.com/photo-1763669029286-7f1662eb921d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhbCUyMGNhc3RpbmclMjBmb3VuZHJ5JTIwaW5kdXN0cmlhbCUyMGZhY3Rvcnl8ZW58MXx8fHwxNzc3NDcxNTU5fDA&ixlib=rb-4.1.0&q=80&w=600", images: [], tag: "热销", is_featured: true, sort_order: 6, created_at: "" },
];

export function ProductsPage() {
  const { t } = useTranslation();
  const { lang } = useSiteConfig();
  const [activeCategory, setActiveCategory] = useState(0);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (activeCategory) params.category_id = String(activeCategory);
    if (search) params.keyword = search;
    getProducts(params)
      .then((data) => setProducts(data.list))
      .catch(() => setProducts(fallbackProducts));
  }, [activeCategory, search]);

  const localizedName = (item: { name: string; name_en?: string; name_es?: string; name_ru?: string }) => {
    if (lang !== 'zh') {
      const key = `name_${lang}` as keyof typeof item;
      if (item[key]) return item[key] as string;
    }
    return item.name;
  };

  const applications = [
    { icon: "🚗", title: t("home.app_auto"), desc: t("home.app_auto_desc") },
    { icon: "⚙️", title: t("home.app_engineering"), desc: t("home.app_engineering_desc") },
    { icon: "⚡", title: t("home.app_power"), desc: t("home.app_power_desc") },
    { icon: "🏗️", title: t("home.app_mining"), desc: t("home.app_mining_desc") },
    { icon: "🚢", title: t("home.app_ship"), desc: t("home.app_ship_desc") },
    { icon: "🌊", title: t("home.app_pump"), desc: t("home.app_pump_desc") },
  ];

  return (
    <div>
      <section className="relative h-44 sm:h-56 md:h-64 flex items-center">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0d1b35]/78" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm mb-2 sm:mb-3">
            <Link to="/" className="hover:text-[#f97316] transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-white">{t("nav.products")}</span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black">{t("products.title")}</h1>
          <p className="text-white/70 mt-1 sm:mt-2 text-sm sm:text-base">{t("products.subtitle")}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-14">
        <div className="mb-6 md:mb-10 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 md:flex-wrap scrollbar-hide">
            <button
              onClick={() => setActiveCategory(0)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                activeCategory === 0 ? "bg-[#f97316] text-white shadow-md shadow-orange-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("products.all_products")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  activeCategory === cat.id ? "bg-[#f97316] text-white shadow-md shadow-orange-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {localizedName(cat)}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("products.search_placeholder")}
              className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7 mb-12 md:mb-16">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  <img src={product.cover_image || "https://images.unsplash.com/photo-1763669029286-7f1662eb921d?w=600"} alt={localizedName(product)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {product.tag && (
                    <span className="absolute top-3 left-3 bg-[#f97316] text-white text-xs px-2.5 py-1 rounded-full font-medium">{product.tag}</span>
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  <div className="text-xs text-[#f97316] font-medium mb-1">{product.category ? localizedName(product.category) : ""}</div>
                  <h3 className="text-[#1a2744] font-bold text-base mb-3">{localizedName(product)}</h3>
                  <div className="space-y-1.5 text-sm text-gray-500 mb-4">
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-400 shrink-0">{t("products.material")}</span>
                      <span className="text-gray-700 font-medium text-right">{product.material || "-"}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-400 shrink-0">{t("products.weight")}</span>
                      <span className="text-gray-700 font-medium">{product.weight_range || "-"}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-400 shrink-0">{t("products.standard")}</span>
                      <span className="text-gray-700 font-medium">{product.standard || "-"}</span>
                    </div>
                  </div>
                  <Link to="/contact" className="w-full text-center block py-2.5 bg-[#1a2744] text-white text-sm rounded font-medium hover:bg-[#f97316] transition-colors">
                    {t("products.inquiry_now")}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20 text-gray-400">
            <p className="text-base sm:text-lg">{t("products.no_results")}</p>
            <p className="text-sm mt-1">{t("products.no_results_hint")}</p>
          </div>
        )}

        <div className="border-t border-gray-100 pt-10 md:pt-14">
          <div className="text-center mb-7 md:mb-10">
            <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">{t("products.applications_tag")}</div>
            <h2 className="text-[#1a2744] text-2xl sm:text-3xl font-black">{t("products.applications_title")}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {applications.map((app) => (
              <div key={app.title} className="text-center p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-orange-50 hover:border-[#f97316]/30 border border-transparent transition-all">
                <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">{app.icon}</div>
                <div className="text-[#1a2744] font-bold text-sm mb-0.5 sm:mb-1">{app.title}</div>
                <div className="text-gray-400 text-xs leading-relaxed hidden sm:block">{app.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

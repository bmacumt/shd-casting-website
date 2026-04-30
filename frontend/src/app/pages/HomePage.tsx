import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle,
  Award,
  Globe,
  Clock,
  Users,
  Wrench,
  Shield,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getFeaturedProducts } from "../utils/api";
import type { Product } from "../utils/api";
import { useSiteConfig } from "../utils/useSiteConfig";

const heroImg = "https://images.unsplash.com/photo-1763669029286-7f1662eb921d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhbCUyMGNhc3RpbmclMjBmb3VuZHJ5JTIwaW5kdXN0cmlhbCUyMGZhY3Rvcnl8ZW58MXx8fHwxNzc3NDcxNTU5fDA&ixlib=rb-4.1.0&q=80&w=1080";
const aboutImg = "https://images.unsplash.com/photo-1682834187151-682c7420e88b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMGNhc3RpbmclMjBtb2x0ZW4lMjBtZXRhbCUyMG1hbnVmYWN0dXJpbmd8ZW58MXx8fHwxNzc3NDcxNTU5fDA&ixlib=rb-4.1.0&q=80&w=1080";
const factoryImg = "https://images.unsplash.com/photo-1764185800646-f75f7e16e465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWN0b3J5JTIwcHJvZHVjdGlvbiUyMGxpbmUlMjBtYW51ZmFjdHVyaW5nJTIwcGxhbnR8ZW58MXx8fHwxNzc3NDcxNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080";

const statIcons = [<Clock className="w-6 h-6 md:w-7 md:h-7" />, <Users className="w-6 h-6 md:w-7 md:h-7" />, <Globe className="w-6 h-6 md:w-7 md:h-7" />, <Award className="w-6 h-6 md:w-7 md:h-7" />];

const defaultAdvantages = [
  { title: "Strict Quality Control", desc: "ISO 9001:2015 certified quality management system with full batch traceability for every casting." },
  { title: "Advanced Equipment", desc: "State-of-the-art imported casting equipment and automated production lines ensuring consistency and precision." },
  { title: "Fast Delivery", desc: "Mature supply chain management — standard parts in 3-7 days, custom parts in 15-30 days." },
  { title: "Global Export Experience", desc: "Products sold to over 30 countries across Europe, Americas, and Southeast Asia with full international trade compliance." },
];
const advIcons = [
  <Shield className="w-7 h-7" />,
  <Wrench className="w-7 h-7" />,
  <TrendingUp className="w-7 h-7" />,
  <Globe className="w-7 h-7" />,
];

const defaultCerts = ["ISO 9001:2015", "CE", "SGS", "BV", "TÜV"];

export function HomePage() {
  const { t } = useTranslation();
  const { cfg, t: cfgT } = useSiteConfig();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const certsJson = cfgT("certifications");
  const certifications = certsJson ? JSON.parse(certsJson).map((c: any) => c.name) : defaultCerts;
  const advJson = cfgT("advantages");
  const advItems = advJson ? JSON.parse(advJson) : defaultAdvantages;

  useEffect(() => {
    getFeaturedProducts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedProducts(data);
        }
      })
      .catch(() => {});
  }, []);

  const heroTitle = cfgT("hero_title") || t("home.about_title");
  const heroSubtitle = cfgT("hero_subtitle") || t("home.about_desc");

  const en = (item: { name: string; name_en?: string }) => item.name_en || item.name;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[520px] flex items-center overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0d1b35]/80 md:bg-gradient-to-r md:from-[#0d1b35]/92 md:via-[#0d1b35]/65 md:to-[#0d1b35]/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#f97316]/20 border border-[#f97316]/40 text-[#f97316] text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse shrink-0" />
              {cfgT("hero_tag") || t("home.hero_tag")}
            </div>

            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-4">
              {heroTitle.split("\n").map((line, i) => (
                <span key={i}>{i > 0 && <br />}{i === 1 ? <span className="text-[#f97316]">{line}</span> : line}</span>
              ))}
            </h1>

            <p className="text-white/75 text-sm sm:text-base md:text-lg leading-relaxed mb-7 max-w-xl">
              {heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-[#f97316] text-white px-6 py-3.5 rounded font-semibold hover:bg-[#ea6c00] transition-all shadow-lg shadow-orange-500/30 text-sm sm:text-base">
                {t("nav.products")} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 border border-white/50 text-white px-6 py-3.5 rounded font-semibold hover:bg-white/10 transition-all text-sm sm:text-base">
                {t("nav.inquiry")}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats ribbon — desktop */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#0d1b35]/85 backdrop-blur-sm hidden md:block">
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-4 divide-x divide-white/10">
            {[
              { value: cfg.stat_years || "20+", label: cfgT("stat_years_label") || t("home.stat_years_label") },
              { value: cfg.stat_clients || "5,000+", label: cfgT("stat_clients_label") || t("home.stat_clients_label") },
              { value: cfg.stat_countries || "30+", label: cfgT("stat_countries_label") || t("home.stat_countries_label") },
              { value: cfg.stat_cert || "ISO9001", label: cfgT("stat_cert_label") || t("home.stat_cert_label") },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 px-6 first:pl-0">
                <div className="text-[#f97316]">{statIcons[i]}</div>
                <div>
                  <div className="text-white text-xl font-black">{s.value}</div>
                  <div className="text-white/50 text-xs">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — mobile */}
      <div className="md:hidden bg-[#1a2744] grid grid-cols-2 divide-x divide-y divide-white/10">
        {[
          { value: cfg.stat_years || "20+", label: cfgT("stat_years_label") || t("home.stat_years_label") },
          { value: cfg.stat_clients || "5,000+", label: cfgT("stat_clients_label") || t("home.stat_clients_label") },
          { value: cfg.stat_countries || "30+", label: cfgT("stat_countries_label") || t("home.stat_countries_label") },
          { value: cfg.stat_cert || "ISO9001", label: cfgT("stat_cert_label") || t("home.stat_cert_label") },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-4">
            <div className="text-[#f97316]">{statIcons[i]}</div>
            <div>
              <div className="text-white text-lg font-black">{s.value}</div>
              <div className="text-white/50 text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* About Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative pb-6 md:pb-0">
            <img src={aboutImg} alt="" className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-xl" />
            <div className="absolute bottom-0 right-0 md:-bottom-5 md:-right-5 bg-[#f97316] text-white p-4 rounded-lg shadow-lg">
              <div className="text-2xl md:text-3xl font-black">20+</div>
              <div className="text-xs md:text-sm">{cfgT("deep_experience") || t("home.deep_experience")}</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              {t("home.about_us_tag")}
            </div>
            <h2 className="text-[#1a2744] text-2xl sm:text-3xl md:text-4xl font-black mb-4 leading-tight">
              {t("home.about_title").split("\n").map((line, i) => (
                <span key={i}>{i > 0 && <br />}{line}</span>
              ))}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3">
              {cfgT("about_desc") || t("home.about_desc")}
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5">
              {cfgT("about_desc2") || t("home.about_desc2")}
            </p>
            <ul className="space-y-2 mb-6">
              {(() => {
                const raw = cfgT("checklist");
                const fallback = [
                  "ISO 9001:2015 Quality Management System Certified",
                  "Complete casting, machining and heat treatment production lines",
                  "Professional R&D team for customized design services",
                  "Strict factory inspection ensuring 100% qualification rate",
                ];
                const items = raw ? JSON.parse(raw) : fallback;
                return items.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#f97316] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ));
              })()}
            </ul>
            <Link to="/about" className="inline-flex items-center gap-2 text-[#f97316] font-semibold hover:gap-3 transition-all text-sm sm:text-base">
              {t("home.learn_more")} <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              {t("home.products_tag")}
            </div>
            <h2 className="text-[#1a2744] text-2xl sm:text-3xl md:text-4xl font-black mb-2 md:mb-3">
              {t("home.products_title")}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              {t("home.products_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <img src={product.cover_image || "https://images.unsplash.com/photo-1763669029286-7f1662eb921d?w=400"} alt={en(product)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 text-2xl">{product.tag === "Hot" ? "🔥" : product.tag === "New" ? "✨" : "⚙️"}</div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-[#1a2744] font-bold mb-1.5 sm:mb-2">{en(product)}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3 sm:mb-4">{product.material || ""}</p>
                  <Link to="/products" className="inline-flex items-center gap-1 text-[#f97316] text-sm font-semibold hover:gap-2 transition-all">
                    {t("home.learn_more")} <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-10">
            <Link to="/products" className="inline-flex items-center gap-2 border-2 border-[#1a2744] text-[#1a2744] px-6 sm:px-8 py-3 rounded font-semibold hover:bg-[#1a2744] hover:text-white transition-all text-sm sm:text-base">
              {t("home.view_all_products")} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Factory Banner */}
      <section className="relative py-14 md:py-20 overflow-hidden">
        <img src={factoryImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0d1b35]/82" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 md:mb-4">
            {t("home.factory_title")}
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto mb-7 md:mb-8">
            {cfgT("factory_desc") || t("home.factory_desc")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-3xl mx-auto">
            {[
              { v: cfg.factory_area || "50,000㎡", l: t("home.factory_area_label") },
              { v: cfg.factory_lines || "5 Lines", l: t("home.factory_lines_label") },
              { v: cfg.factory_capacity || "50,000 Tons", l: t("home.factory_capacity_label") },
              { v: cfg.factory_staff || "200+", l: t("home.factory_staff_label") },
            ].map((item) => (
              <div key={item.l} className="bg-white/10 backdrop-blur rounded-lg p-3 sm:p-4 border border-white/20">
                <div className="text-[#f97316] text-lg sm:text-xl md:text-2xl font-black">{item.v}</div>
                <div className="text-white/60 text-xs mt-0.5 sm:mt-1">{item.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              {t("home.advantages_tag")}
            </div>
            <h2 className="text-[#1a2744] text-2xl sm:text-3xl md:text-4xl font-black mb-2">
              {t("home.advantages_title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {advItems.map((adv: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-5 sm:p-7 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex sm:block gap-4 items-start">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-orange-50 flex items-center justify-center text-[#f97316] shrink-0 sm:mb-5 group-hover:bg-[#f97316] group-hover:text-white transition-colors">
                  {advIcons[i]}
                </div>
                <div>
                  <h3 className="text-[#1a2744] font-bold mb-1.5">{adv.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{adv.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-10 md:py-12 bg-[#1a2744]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <h3 className="text-white font-bold text-base sm:text-lg">{t("home.cert_title")}</h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {certifications.map((cert: string) => (
              <div key={cert} className="px-4 sm:px-6 py-2 border border-white/20 text-white/80 rounded-full text-xs sm:text-sm font-medium hover:border-[#f97316] hover:text-[#f97316] transition-colors cursor-default">
                {cert}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[#1a2744] text-2xl sm:text-3xl md:text-4xl font-black mb-3 md:mb-4">
            {t("home.cta_title")}
          </h2>
          <p className="text-gray-500 mb-6 md:mb-8 text-sm sm:text-base md:text-lg">
            {t("home.cta_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-[#f97316] text-white px-7 py-3.5 rounded font-semibold hover:bg-[#ea6c00] transition-all shadow-lg shadow-orange-500/30 text-sm sm:text-base">
              {t("home.get_quote")} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <a href="tel:+862112345678" className="inline-flex items-center justify-center gap-2 border-2 border-[#1a2744] text-[#1a2744] px-7 py-3.5 rounded font-semibold hover:bg-[#1a2744] hover:text-white transition-all text-sm sm:text-base">
              {t("home.phone_consult")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

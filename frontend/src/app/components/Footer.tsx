import { NavLink } from "react-router";
import { Phone, Mail, MapPin, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSiteConfig } from "../utils/useSiteConfig";

export function Footer() {
  const { t } = useTranslation();
  const { cfg, t: cfgT } = useSiteConfig();

  return (
    <footer className="bg-[#0d1b35] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-[#f97316] rounded flex items-center justify-center shrink-0">
              <span className="text-white font-black text-sm">SHD</span>
            </div>
            <div>
              <div className="text-white font-bold text-base leading-tight">{cfg.company_name || "上海铸造有限公司"}</div>
              <div className="text-white/50 text-xs">{cfg.company_name_en || "SHD CASTING CO., LTD"}</div>
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            {cfgT("company_intro") || "专注于高精度铸件制造20余年，为全球客户提供优质的铸铁、铸钢及铝合金铸件解决方案。"}
          </p>
          <div className="flex gap-2">
            {[
              { label: t("footer.social_wechat"), initial: "微" },
              { label: t("footer.social_weibo"), initial: "博" },
              { label: t("footer.social_linkedin"), initial: "in" },
            ].map((s) => (
              <button
                key={s.label}
                className="w-9 h-9 rounded bg-white/10 hover:bg-[#f97316] text-xs text-white/70 hover:text-white transition-colors flex items-center justify-center"
              >
                {s.initial}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 pb-2 border-b border-white/10 text-sm">
            {t("footer.quick_links")}
          </h4>
          <ul className="space-y-2">
            {[
              { label: t("footer.company_home"), to: "/" },
              { label: t("nav.products"), to: "/products" },
              { label: t("nav.about"), to: "/about" },
              { label: t("nav.contact"), to: "/contact" },
              { label: t("footer.certification"), to: "/about" },
            ].map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  className="text-white/60 hover:text-[#f97316] text-sm transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-[#f97316] shrink-0" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 pb-2 border-b border-white/10 text-sm">
            {t("footer.product_series")}
          </h4>
          <ul className="space-y-2">
            {[
              t("footer.cast_iron"),
              t("footer.ductile_iron"),
              t("footer.steel_casting"),
              t("footer.aluminum_casting"),
              t("footer.investment_casting"),
              t("footer.heavy_casting"),
            ].map((p) => (
              <li key={p}>
                <NavLink
                  to="/products"
                  className="text-white/60 hover:text-[#f97316] text-sm transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-[#f97316] shrink-0" />
                  {p}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 pb-2 border-b border-white/10 text-sm">
            {t("footer.contact_info")}
          </h4>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm text-white/60">
              <MapPin className="w-4 h-4 text-[#f97316] mt-0.5 shrink-0" />
              <span>{cfgT("address") || cfg.address || "上海市奉贤区工业园区铸造路88号"}{cfg.zipcode && ` (${cfg.zipcode})`}</span>
            </li>
            <li>
              <a href={`tel:${cfg.phone || "+862112345678"}`} className="flex gap-3 text-sm text-white/60 hover:text-[#f97316] transition-colors">
                <Phone className="w-4 h-4 text-[#f97316] shrink-0" />
                <span>{cfg.phone || "+86 21 1234 5678"}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${cfg.email || "info@shdcasting.com"}`} className="flex gap-3 text-sm text-white/60 hover:text-[#f97316] transition-colors">
                <Mail className="w-4 h-4 text-[#f97316] shrink-0" />
                <span>{cfg.email || "info@shdcasting.com"}</span>
              </a>
            </li>
            <li className="flex gap-3 text-sm text-white/60">
              <Globe className="w-4 h-4 text-[#f97316] shrink-0" />
              <span>www.shdcasting.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>© 2024 {cfg.company_name || "上海铸造有限公司"} {t("footer.copyright")}</span>
          <span>{t("footer.icp")}</span>
        </div>
      </div>
    </footer>
  );
}

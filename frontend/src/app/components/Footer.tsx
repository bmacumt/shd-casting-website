import { NavLink } from "react-router";
import { Phone, Mail, MapPin, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0d1b35] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-[#f97316] rounded flex items-center justify-center shrink-0">
              <span className="text-white font-black text-sm">SHD</span>
            </div>
            <div>
              <div className="text-white font-bold text-base leading-tight">上海铸造有限公司</div>
              <div className="text-white/50 text-xs">SHD CASTING CO., LTD</div>
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            专注于高精度铸件制造20余年，为全球客户提供优质的铸铁、铸钢及铝合金铸件解决方案。
          </p>
          <div className="flex gap-2">
            {["微信", "微博", "领英"].map((s) => (
              <button
                key={s}
                className="w-9 h-9 rounded bg-white/10 hover:bg-[#f97316] text-xs text-white/70 hover:text-white transition-colors flex items-center justify-center"
              >
                {s[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-semibold mb-4 pb-2 border-b border-white/10 text-sm">
            快速导航
          </h4>
          <ul className="space-y-2">
            {[
              { label: "公司首页", to: "/" },
              { label: "产品中心", to: "/products" },
              { label: "关于我们", to: "/about" },
              { label: "联系我们", to: "/contact" },
              { label: "资质认证", to: "/about" },
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

        {/* Products */}
        <div>
          <h4 className="text-white font-semibold mb-4 pb-2 border-b border-white/10 text-sm">
            产品系列
          </h4>
          <ul className="space-y-2">
            {["灰铸铁件", "球墨铸铁件", "铸钢件", "铝合金铸件", "精密铸造件", "大型铸件"].map((p) => (
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

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4 pb-2 border-b border-white/10 text-sm">
            联系方式
          </h4>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm text-white/60">
              <MapPin className="w-4 h-4 text-[#f97316] mt-0.5 shrink-0" />
              <span>上海市奉贤区工业园区铸造路88号</span>
            </li>
            <li>
              <a
                href="tel:+862112345678"
                className="flex gap-3 text-sm text-white/60 hover:text-[#f97316] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#f97316] shrink-0" />
                <span>+86 21 1234 5678</span>
              </a>
            </li>
            <li>
              <a
                href="mailto:info@shdcasting.com"
                className="flex gap-3 text-sm text-white/60 hover:text-[#f97316] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#f97316] shrink-0" />
                <span>info@shdcasting.com</span>
              </a>
            </li>
            <li className="flex gap-3 text-sm text-white/60">
              <Globe className="w-4 h-4 text-[#f97316] shrink-0" />
              <span>www.shdcasting.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>© 2024 上海铸造有限公司 版权所有</span>
          <span>沪ICP备XXXXXXXX号 | 技术支持：XX科技</span>
        </div>
      </div>
    </footer>
  );
}

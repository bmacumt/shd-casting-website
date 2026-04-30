import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import { getSiteConfig } from "../utils/api";

const navLinks = [
  { label: "首页", to: "/" },
  { label: "产品中心", to: "/products" },
  { label: "关于我们", to: "/about" },
  { label: "联系我们", to: "/contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cfg, setCfg] = useState<Record<string, string>>({});
  const location = useLocation();

  useEffect(() => { getSiteConfig().then(setCfg).catch(() => {}); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#1a2744] text-white/80 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <span>{cfg.navbar_tag || "专业铸件制造商 · 20年行业经验"}</span>
          <div className="flex items-center gap-6">
            <a href={`tel:${cfg.phone || "+862112345678"}`} className="flex items-center gap-1.5 hover:text-[#f97316] transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span>{cfg.phone || "+86 21 1234 5678"}</span>
            </a>
            <a href={`mailto:${cfg.email || "info@shdcasting.com"}`} className="flex items-center gap-1.5 hover:text-[#f97316] transition-colors">
              <Mail className="w-3.5 h-3.5" />
              <span>{cfg.email || "info@shdcasting.com"}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg" : "bg-white shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#1a2744] rounded flex items-center justify-center">
              <span className="text-[#f97316] font-black text-lg">SHD</span>
            </div>
            <div>
              <div className="text-[#1a2744] font-black text-xl leading-tight tracking-wide">上海铸造</div>
              <div className="text-[#f97316] text-xs tracking-widest">SHD CASTING CO.,LTD</div>
            </div>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `px-5 py-2 text-sm font-medium transition-all rounded relative ${
                    isActive
                      ? "text-[#f97316] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-0.5 after:bg-[#f97316] after:rounded-full"
                      : "text-[#1a2744] hover:text-[#f97316]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href="/contact"
              className="ml-4 px-5 py-2 bg-[#f97316] text-white text-sm font-medium rounded hover:bg-[#ea6c00] transition-colors"
            >
              立即询价
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-[#1a2744] hover:text-[#f97316] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
            <div className="px-6 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `px-4 py-3 text-sm font-medium rounded transition-colors ${
                      isActive ? "bg-orange-50 text-[#f97316]" : "text-[#1a2744] hover:bg-gray-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <a
                href="/contact"
                className="mt-2 px-4 py-3 bg-[#f97316] text-white text-sm font-medium rounded text-center"
              >
                立即询价
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

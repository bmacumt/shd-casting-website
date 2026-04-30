import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { adminLogout } from "../../utils/api";

const NAV_ITEMS = [
  { path: "/admin/dashboard", label: "仪表盘", icon: "📊" },
  { path: "/admin/inquiries", label: "询价管理", icon: "📨" },
  { path: "/admin/products", label: "产品管理", icon: "📦" },
  { path: "/admin/categories", label: "分类管理", icon: "🏷️" },
  { path: "/admin/site-config", label: "站点信息", icon: "⚙️" },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try { await adminLogout(); } catch { /* ignore */ }
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-60 bg-[#1a2744] text-white transform transition-transform md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-white/10">
          <h2 className="font-bold text-lg">SHD Casting</h2>
          <p className="text-white/50 text-xs mt-0.5">管理后台</p>
        </div>
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === item.path ? "bg-[#f97316] text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
            <span>🚪</span> 退出登录
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="bg-white border-b px-4 sm:px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="text-lg font-bold text-[#1a2744]">
            {NAV_ITEMS.find((i) => i.path === location.pathname)?.label || "管理后台"}
          </h1>
        </header>
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

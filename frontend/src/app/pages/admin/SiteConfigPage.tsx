import { useState, useEffect } from "react";
import { getSiteConfig, adminUpdateSiteConfig } from "../../utils/api";

const FIELDS = [
  { key: "company_name", label: "公司名称" },
  { key: "company_name_en", label: "公司英文名" },
  { key: "address", label: "公司地址" },
  { key: "address_en", label: "英文地址" },
  { key: "zipcode", label: "邮编" },
  { key: "phone", label: "总机电话" },
  { key: "phone_sales", label: "销售热线" },
  { key: "email", label: "公司邮箱" },
  { key: "email_sales", label: "销售邮箱" },
  { key: "work_hours", label: "工作日时间" },
  { key: "work_hours_weekend", label: "周末时间" },
  { key: "company_intro", label: "公司简介" },
  { key: "factory_area", label: "厂房面积" },
  { key: "annual_capacity", label: "年产能" },
  { key: "export_countries", label: "出口国家数" },
  { key: "years_experience", label: "行业经验" },
  { key: "clients_count", label: "合作客户数" },
];

export function SiteConfigPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => { getSiteConfig().then(setConfig).catch(() => {}); }, []);

  const handleSave = async () => {
    await adminUpdateSiteConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-4">
      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
          {f.key === "company_intro" ? (
            <textarea value={config[f.key] || ""} onChange={(e) => setConfig({ ...config, [f.key]: e.target.value })}
              rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
          ) : (
            <input value={config[f.key] || ""} onChange={(e) => setConfig({ ...config, [f.key]: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          )}
        </div>
      ))}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={handleSave} className="px-6 py-2.5 bg-[#f97316] text-white rounded-lg font-medium hover:bg-[#ea6c00]">保存修改</button>
        {saved && <span className="text-green-600 text-sm">已保存</span>}
      </div>
    </div>
  );
}

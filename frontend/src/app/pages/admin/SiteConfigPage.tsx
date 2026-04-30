import { useState, useEffect } from "react";
import { getSiteConfig, adminUpdateSiteConfig } from "../../utils/api";

const SECTIONS: { title: string; fields: { key: string; label: string; type?: "textarea" }[] }[] = [
  {
    title: "公司基本信息",
    fields: [
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
      { key: "company_intro", label: "公司简介", type: "textarea" },
    ],
  },
  {
    title: "首页 Hero 区域",
    fields: [
      { key: "hero_tag", label: "顶部标签文字" },
      { key: "hero_title", label: "主标题（换行用 \\n）" },
      { key: "hero_subtitle", label: "副标题", type: "textarea" },
    ],
  },
  {
    title: "首页统计数字",
    fields: [
      { key: "stat_years", label: "行业经验数值" },
      { key: "stat_years_label", label: "行业经验标签" },
      { key: "stat_clients", label: "合作客户数值" },
      { key: "stat_clients_label", label: "合作客户标签" },
      { key: "stat_countries", label: "出口国家数值" },
      { key: "stat_countries_label", label: "出口国家标签" },
      { key: "stat_cert", label: "质量认证数值" },
      { key: "stat_cert_label", label: "质量认证标签" },
    ],
  },
  {
    title: "工厂数据",
    fields: [
      { key: "factory_area", label: "厂房面积" },
      { key: "factory_lines", label: "自动化生产线" },
      { key: "factory_capacity", label: "年生产能力" },
      { key: "factory_staff", label: "专业技术人员" },
    ],
  },
  {
    title: "核心优势（JSON数组）",
    fields: [{ key: "advantages", label: "优势列表", type: "textarea" }],
  },
  {
    title: "资质认证（JSON数组）",
    fields: [{ key: "certifications", label: "认证列表", type: "textarea" }],
  },
  {
    title: "发展历程（JSON数组）",
    fields: [{ key: "milestones", label: "里程碑列表", type: "textarea" }],
  },
  {
    title: "管理团队（JSON数组）",
    fields: [{ key: "team", label: "团队成员列表", type: "textarea" }],
  },
  {
    title: "常见问题 FAQ（JSON数组）",
    fields: [{ key: "faqs", label: "FAQ列表", type: "textarea" }],
  },
  {
    title: "导航栏",
    fields: [{ key: "navbar_tag", label: "顶部信息栏文字" }],
  },
];

export function SiteConfigPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [openSection, setOpenSection] = useState(0);

  useEffect(() => { getSiteConfig().then(setConfig).catch(() => {}); }, []);

  const handleSave = async () => {
    await adminUpdateSiteConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-3">
      {SECTIONS.map((section, si) => (
        <div key={section.title} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setOpenSection(openSection === si ? -1 : si)}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-[#1a2744] text-sm">{section.title}</span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${openSection === si ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {openSection === si && (
            <div className="px-5 pb-5 space-y-3 border-t border-gray-50">
              {section.fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea value={config[f.key] || ""} onChange={(e) => setConfig({ ...config, [f.key]: e.target.value })}
                      rows={6} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono text-xs resize-y" />
                  ) : (
                    <input value={config[f.key] || ""} onChange={(e) => setConfig({ ...config, [f.key]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center gap-3 pt-2 sticky bottom-0 bg-gray-50 py-3 -mx-1 px-1">
        <button onClick={handleSave} className="px-6 py-2.5 bg-[#f97316] text-white rounded-lg font-medium hover:bg-[#ea6c00]">保存全部修改</button>
        {saved && <span className="text-green-600 text-sm font-medium">已保存</span>}
      </div>
    </div>
  );
}

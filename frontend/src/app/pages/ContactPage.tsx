import { useState } from "react";
import { submitInquiry } from "../utils/api";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ChevronRight, Phone, Mail, MapPin, Clock, Send, CheckCircle, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSiteConfig } from "../utils/useSiteConfig";

const heroImg = "https://images.unsplash.com/photo-1682834187151-682c7420e88b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMGNhc3RpbmclMjBtb2x0ZW4lMjBtZXRhbCUyMG1hbnVmYWN0dXJpbmd8ZW58MXx8fHwxNzc3NDcxNTU5fDA&ixlib=rb-4.1.0&q=80&w=1080";

const defaultFaqs = [
  { q: "最小起订量是多少？", a: "我们的最小起订量根据产品规格不同而有所差异，一般单品种最低起订1吨或50件（以重量较大者为准）。样品订单可协商。" },
  { q: "交货周期一般是多长时间？", a: "标准产品一般3-7个工作日；定制化产品根据复杂程度，通常需要15-30个工作日；大批量订单另行协商。" },
  { q: "是否提供样品服务？", a: "是的，我们提供付费样品服务。样品费用在签订正式合同后可从首批货款中扣除。" },
  { q: "是否接受定制化订单？", a: "我们接受各类定制化铸件订单，包括特殊材质、特殊尺寸、特殊工艺等。请提供图纸或详细规格，我们将为您评估并报价。" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-start gap-3 p-4 sm:p-6 text-left">
        <div className="w-6 h-6 rounded-full bg-[#f97316] text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">Q</div>
        <span className="flex-1 text-[#1a2744] font-bold text-sm sm:text-base">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform mt-0.5 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-5 pl-13">
          <div className="ml-9 text-gray-500 text-sm leading-relaxed">{a}</div>
        </div>
      )}
    </div>
  );
}

export function ContactPage() {
  const { t } = useTranslation();
  const { cfg, t: cfgT } = useSiteConfig();
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", product: "", quantity: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const faqsJson = cfgT("faqs");
  const faqs = faqsJson ? JSON.parse(faqsJson) : defaultFaqs;

  const productOptions = [
    t("contact.product_cat_cast_iron"),
    t("contact.product_cat_ductile_iron"),
    t("contact.product_cat_steel"),
    t("contact.product_cat_aluminum"),
    t("contact.product_cat_investment"),
    t("contact.product_cat_other"),
  ];

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: t("contact.address_title"),
      lines: [cfgT("address") || cfg.address || "上海市奉贤区工业园区铸造路88号", cfg.zipcode ? `${t("contact.zipcode_prefix")}${cfg.zipcode}` : `${t("contact.zipcode_prefix")}201499`],
    },
    {
      icon: <Phone className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: t("contact.phone_title"),
      lines: [
        cfg.phone ? `${cfg.phone}${t("contact.phone_main_suffix")}` : `+86 21 1234 5678${t("contact.phone_main_suffix")}`,
        cfg.phone_sales ? `${cfg.phone_sales}${t("contact.phone_sales_suffix")}` : `+86 135 0000 1234${t("contact.phone_sales_suffix")}`,
      ],
    },
    {
      icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: t("contact.email_title"),
      lines: [cfg.email || "info@shdcasting.com", cfg.email_sales || "sales@shdcasting.com"],
    },
    {
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: t("contact.hours_title"),
      lines: [
        cfg.work_hours ? `${t("contact.weekday_prefix")}${cfg.work_hours}` : `${t("contact.weekday_prefix")}08:30 - 17:30`,
        cfg.work_hours_weekend ? `${t("contact.weekend_prefix")}${cfg.work_hours_weekend}` : `${t("contact.weekend_prefix")}09:00 - 12:00`,
      ],
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitInquiry({
        name: form.name,
        company: form.company || undefined,
        email: form.email,
        phone: form.phone || undefined,
        product_category: form.product || undefined,
        quantity: form.quantity || undefined,
        message: form.message,
      });
      setSubmitted(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "提交失败，请稍后重试";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({ name: "", company: "", email: "", phone: "", product: "", quantity: "", message: "" });
  };

  return (
    <div>
      {/* Page Hero */}
      <section className="relative h-44 sm:h-56 md:h-64 flex items-center">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0d1b35]/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm mb-2 sm:mb-3">
            <Link to="/" className="hover:text-[#f97316] transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-white">{t("nav.contact")}</span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black">{t("contact.title")}</h1>
          <p className="text-white/70 mt-1 sm:mt-2 text-sm sm:text-base">{t("contact.subtitle")}</p>
        </div>
      </section>

      {/* Mobile Quick Actions */}
      <div className="md:hidden bg-white border-b border-gray-100">
        <div className="flex divide-x divide-gray-100">
          <a href={`tel:${cfg.phone || "+862112345678"}`} className="flex-1 flex items-center justify-center gap-2 py-3.5 text-[#1a2744] font-semibold text-sm active:bg-gray-50">
            <Phone className="w-4 h-4 text-[#f97316]" />
            {t("contact.call_now")}
          </a>
          <a href={`mailto:${cfg.email_sales || "sales@shdcasting.com"}`} className="flex-1 flex items-center justify-center gap-2 py-3.5 text-[#1a2744] font-semibold text-sm active:bg-gray-50">
            <Mail className="w-4 h-4 text-[#f97316]" />
            {t("contact.send_email")}
          </a>
        </div>
      </div>

      <section className="py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-10">
            {/* Contact info */}
            <div className="lg:col-span-1 space-y-4">
              <div className="mb-6">
                <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
                  {t("contact.contact_tag")}
                </div>
                <h2 className="text-[#1a2744] text-2xl sm:text-3xl font-black mb-2">{t("contact.contact_title")}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{t("contact.contact_desc")}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {contactInfo.map((info) => (
                  <motion.div key={info.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                    className="flex gap-3 sm:gap-4 p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#1a2744] flex items-center justify-center text-[#f97316] shrink-0">{info.icon}</div>
                    <div className="min-w-0">
                      <div className="text-[#1a2744] font-bold text-xs sm:text-sm mb-0.5">{info.title}</div>
                      {info.lines.map((line) => (
                        <div key={line} className="text-gray-500 text-xs sm:text-sm truncate">{line}</div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative hidden sm:block">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <MapPin className="w-8 h-8 mb-2 text-[#f97316]" />
                  <span className="text-sm font-medium text-gray-600">{cfgT("address") || cfg.address || t("contact.map_area")}</span>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-lg p-5 sm:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-10 sm:py-16">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-50 flex items-center justify-center mb-5">
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                  </div>
                  <h3 className="text-[#1a2744] text-xl sm:text-2xl font-black mb-3">{t("contact.success_title")}</h3>
                  <p className="text-gray-500 text-sm max-w-md mb-6 leading-relaxed">{t("contact.success_message")}</p>
                  <button onClick={resetForm} className="px-6 py-2.5 bg-[#f97316] text-white rounded font-medium hover:bg-[#ea6c00] transition-colors text-sm">
                    {t("contact.submit_again")}
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-5 sm:mb-7">
                    <h3 className="text-[#1a2744] text-xl sm:text-2xl font-black mb-1">{t("contact.form_title")}</h3>
                    <p className="text-gray-400 text-sm">{t("contact.form_subtitle")}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t("contact.form_name")} <span className="text-red-500">{t("contact.required")}</span>
                        </label>
                        <input required type="text" name="name" value={form.name} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("contact.form_company")}</label>
                        <input type="text" name="company" value={form.company} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-colors" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t("contact.form_email")} <span className="text-red-500">{t("contact.required")}</span>
                        </label>
                        <input required type="email" name="email" value={form.email} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("contact.form_phone")}</label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-colors" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("contact.form_product")}</label>
                        <select name="product" value={form.product} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-colors bg-white">
                          <option value="">{t("contact.form_product_placeholder")}</option>
                          {productOptions.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("contact.form_quantity")}</label>
                        <input type="text" name="quantity" value={form.quantity} onChange={handleChange}
                          placeholder={t("contact.form_quantity_placeholder")}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-colors" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t("contact.form_message")} <span className="text-red-500">{t("contact.required")}</span>
                      </label>
                      <textarea required name="message" value={form.message} onChange={handleChange} rows={4}
                        placeholder={t("contact.form_message_placeholder")}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-colors resize-none" />
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full py-4 bg-[#f97316] text-white font-semibold rounded-lg hover:bg-[#ea6c00] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-orange-500/20 text-sm sm:text-base">
                      {loading ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("contact.form_submitting")}</>
                      ) : (
                        <><Send className="w-4 h-4" />{t("contact.form_submit")}</>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400">{t("contact.form_privacy")}</p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-7 md:mb-10">
            <h3 className="text-[#1a2744] text-2xl sm:text-3xl font-black">{t("contact.faq_title")}</h3>
          </div>
          <div className="space-y-3">
            {faqs.map((faq: any) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

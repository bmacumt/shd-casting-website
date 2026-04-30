import { useState, useEffect } from "react";
import { submitInquiry, getSiteConfig } from "../utils/api";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ChevronRight, Phone, Mail, MapPin, Clock, Send, CheckCircle, ChevronDown } from "lucide-react";

const heroImg = "https://images.unsplash.com/photo-1682834187151-682c7420e88b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMGNhc3RpbmclMjBtb2x0ZW4lMjBtZXRhbCUyMG1hbnVmYWN0dXJpbmd8ZW58MXx8fHwxNzc3NDcxNTU5fDA&ixlib=rb-4.1.0&q=80&w=1080";

const productOptions = [
  "灰铸铁件", "球墨铸铁件", "铸钢件", "铝合金铸件", "精密铸造件", "其他产品",
];

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
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-4 sm:p-6 text-left"
      >
        <div className="w-6 h-6 rounded-full bg-[#f97316] text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
          Q
        </div>
        <span className="flex-1 text-[#1a2744] font-bold text-sm sm:text-base">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform mt-0.5 ${open ? "rotate-180" : ""}`}
        />
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
  const [cfg, setCfg] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    product: "",
    quantity: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSiteConfig().then(setCfg).catch(() => {});
  }, []);

  const faqs = cfg.faqs ? JSON.parse(cfg.faqs) : defaultFaqs;

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "公司地址",
      lines: [cfg.address || "上海市奉贤区工业园区铸造路88号", cfg.zipcode ? `邮编：${cfg.zipcode}` : "邮编：201499"],
    },
    {
      icon: <Phone className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "联系电话",
      lines: [
        cfg.phone ? `${cfg.phone}（总机）` : "+86 21 1234 5678（总机）",
        cfg.phone_sales ? `${cfg.phone_sales}（销售热线）` : "+86 135 0000 1234（销售热线）",
      ],
    },
    {
      icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "电子邮件",
      lines: [cfg.email || "info@shdcasting.com", cfg.email_sales || "sales@shdcasting.com"],
    },
    {
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "工作时间",
      lines: [
        cfg.work_hours ? `周一至周五：${cfg.work_hours}` : "周一至周五：08:30 - 17:30",
        cfg.work_hours_weekend ? `周六：${cfg.work_hours_weekend}` : "周六：09:00 - 12:00",
      ],
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      {/* ───── Page Hero ───── */}
      <section className="relative h-44 sm:h-56 md:h-64 flex items-center">
        <img src={heroImg} alt="联系我们" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0d1b35]/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm mb-2 sm:mb-3">
            <Link to="/" className="hover:text-[#f97316] transition-colors">首页</Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-white">联系我们</span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black">联系我们</h1>
          <p className="text-white/70 mt-1 sm:mt-2 text-sm sm:text-base">
            我们期待为您提供专业的铸件解决方案
          </p>
        </div>
      </section>

      {/* ───── Mobile Quick Actions ───── */}
      <div className="md:hidden bg-white border-b border-gray-100">
        <div className="flex divide-x divide-gray-100">
          <a
            href={`tel:${cfg.phone || "+862112345678"}`}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 text-[#1a2744] font-semibold text-sm active:bg-gray-50"
          >
            <Phone className="w-4 h-4 text-[#f97316]" />
            立即拨打
          </a>
          <a
            href={`mailto:${cfg.email_sales || "sales@shdcasting.com"}`}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 text-[#1a2744] font-semibold text-sm active:bg-gray-50"
          >
            <Mail className="w-4 h-4 text-[#f97316]" />
            发送邮件
          </a>
        </div>
      </div>

      <section className="py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-10">
            {/* ── Contact info (left column) ── */}
            <div className="lg:col-span-1 space-y-4">
              <div className="mb-6">
                <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
                  联系方式
                </div>
                <h2 className="text-[#1a2744] text-2xl sm:text-3xl font-black mb-2">与我们取得联系</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  我们的销售团队将在1个工作日内回复您的询问，并为您提供详细的技术支持和报价服务。
                </p>
              </div>

              {/* Info cards — 2 column on mobile, stacked on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {contactInfo.map((info) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex gap-3 sm:gap-4 p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#1a2744] flex items-center justify-center text-[#f97316] shrink-0">
                      {info.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[#1a2744] font-bold text-xs sm:text-sm mb-0.5">{info.title}</div>
                      {info.lines.map((line) => (
                        <div key={line} className="text-gray-500 text-xs sm:text-sm truncate">{line}</div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative hidden sm:block">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <MapPin className="w-8 h-8 mb-2 text-[#f97316]" />
                  <span className="text-sm font-medium text-gray-600">{cfg.address || "上海市奉贤区工业园区"}</span>
                </div>
              </div>
            </div>

            {/* ── Contact form (right) ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-lg p-5 sm:p-8"
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-10 sm:py-16">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-50 flex items-center justify-center mb-5">
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                  </div>
                  <h3 className="text-[#1a2744] text-xl sm:text-2xl font-black mb-3">询价已提交！</h3>
                  <p className="text-gray-500 text-sm max-w-md mb-6 leading-relaxed">
                    感谢您的询价，我们的销售团队将在1个工作日内与您联系，为您提供详细报价和技术支持。
                  </p>
                  <button
                    onClick={resetForm}
                    className="px-6 py-2.5 bg-[#f97316] text-white rounded font-medium hover:bg-[#ea6c00] transition-colors text-sm"
                  >
                    再次询价
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-5 sm:mb-7">
                    <h3 className="text-[#1a2744] text-xl sm:text-2xl font-black mb-1">在线询价</h3>
                    <p className="text-gray-400 text-sm">填写下方表单，我们将尽快与您联系</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          姓名 <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="请输入您的姓名"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">公司名称</label>
                        <input
                          type="text"
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          placeholder="请输入公司名称"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          邮箱 <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">联系电话</label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+86 手机号码"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">产品类别</label>
                        <select
                          name="product"
                          value={form.product}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-colors bg-white"
                        >
                          <option value="">请选择产品类别</option>
                          {productOptions.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">预计采购量</label>
                        <input
                          type="text"
                          name="quantity"
                          value={form.quantity}
                          onChange={handleChange}
                          placeholder="例：500件 / 10吨"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Textarea */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        详细需求 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="请描述您的铸件规格、材质要求、技术标准、应用场景等详细信息，以便我们为您提供更准确的报价…"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#f97316] text-white font-semibold rounded-lg hover:bg-[#ea6c00] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-orange-500/20 text-sm sm:text-base"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          提交中…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          提交询价申请
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                      提交即表示您同意我们的隐私政策，我们承诺保护您的个人信息安全
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-7 md:mb-10">
            <h3 className="text-[#1a2744] text-2xl sm:text-3xl font-black">常见问题</h3>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

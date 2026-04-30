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
import { getFeaturedProducts } from "../utils/api";
import type { Product } from "../utils/api";

const heroImg = "https://images.unsplash.com/photo-1763669029286-7f1662eb921d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhbCUyMGNhc3RpbmclMjBmb3VuZHJ5JTIwaW5kdXN0cmlhbCUyMGZhY3Rvcnl8ZW58MXx8fHwxNzc3NDcxNTU5fDA&ixlib=rb-4.1.0&q=80&w=1080";
const aboutImg = "https://images.unsplash.com/photo-1682834187151-682c7420e88b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMGNhc3RpbmclMjBtb2x0ZW4lMjBtZXRhbCUyMG1hbnVmYWN0dXJpbmd8ZW58MXx8fHwxNzc3NDcxNTU5fDA&ixlib=rb-4.1.0&q=80&w=1080";
const factoryImg = "https://images.unsplash.com/photo-1764185800646-f75f7e16e465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWN0b3J5JTIwcHJvZHVjdGlvbiUyMGxpbmUlMjBtYW51ZmFjdHVyaW5nJTIwcGxhbnR8ZW58MXx8fHwxNzc3NDcxNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080";

const products = [
  {
    title: "灰铸铁件",
    desc: "广泛应用于机床、汽车、管道等领域，具有优良的铸造性和切削性。",
    icon: "⚙️",
    img: "https://images.unsplash.com/photo-1767739791246-9f832345f8f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbWV0YWwlMjBwYXJ0cyUyMG1hY2hpbmVyeSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3Nzc0NzE1NTl8MA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    title: "球墨铸铁件",
    desc: "高强度、高韧性，适用于承受冲击和振动的工程机械等关键部件。",
    icon: "🔩",
    img: "https://images.unsplash.com/photo-1748640857973-93524ef0fe7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVjaXNpb24lMjBlbmdpbmVlcmluZyUyMHdvcmtzaG9wJTIwQ05DJTIwbWFjaGluaW5nfGVufDF8fHx8MTc3NzQ3MTU2MHww&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    title: "铸钢件",
    desc: "优异的力学性能，广泛用于重型机械、矿山设备及电力行业。",
    icon: "🏗️",
    img: "https://images.unsplash.com/photo-1763669029286-7f1662eb921d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhbCUyMGNhc3RpbmclMjBmb3VuZHJ5JTIwaW5kdXN0cmlhbCUyMGZhY3Rvcnl8ZW58MXx8fHwxNzc3NDcxNTU5fDA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    title: "铝合金铸件",
    desc: "轻量化解决方案，适用于汽车、航空航天及消费电子等新兴领域。",
    icon: "✈️",
    img: "https://images.unsplash.com/photo-1682834187151-682c7420e88b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMGNhc3RpbmclMjBtb2x0ZW4lMjBtZXRhbCUyMG1hbnVmYWN0dXJpbmd8ZW58MXx8fHwxNzc3NDcxNTU5fDA&ixlib=rb-4.1.0&q=80&w=400",
  },
];

const stats = [
  { value: "20+", label: "年行业经验", icon: <Clock className="w-6 h-6 md:w-7 md:h-7" /> },
  { value: "5000+", label: "合作客户", icon: <Users className="w-6 h-6 md:w-7 md:h-7" /> },
  { value: "30+", label: "出口国家", icon: <Globe className="w-6 h-6 md:w-7 md:h-7" /> },
  { value: "ISO9001", label: "质量认证", icon: <Award className="w-6 h-6 md:w-7 md:h-7" /> },
];

const advantages = [
  {
    icon: <Shield className="w-7 h-7" />,
    title: "严格质量管控",
    desc: "通过ISO 9001:2015质量管理体系认证，全程追溯每一批次铸件质量。",
  },
  {
    icon: <Wrench className="w-7 h-7" />,
    title: "先进生产设备",
    desc: "引进国内外先进铸造设备，自动化生产线确保产品一致性与精度。",
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    title: "快速交货能力",
    desc: "成熟的供应链管理体系，标准件3-7天，定制件15-30天交货。",
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: "全球出口经验",
    desc: "产品畅销欧美、东南亚30余个国家和地区，熟悉国际贸易规则。",
  },
];

const certifications = ["ISO 9001:2015", "CE认证", "SGS认证", "BV检验", "TÜV认证"];

export function HomePage() {
  const [featured, setFeatured] = useState(products);

  useEffect(() => {
    getFeaturedProducts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFeatured(
            data.map((p: Product) => ({
              title: p.name,
              desc: p.material || "",
              icon: p.tag === "热销" ? "🔥" : p.tag === "新品" ? "✨" : "⚙️",
              img: p.cover_image || "https://images.unsplash.com/photo-1763669029286-7f1662eb921d?w=400",
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* ───── Hero Section ───── */}
      <section className="relative h-[85vh] min-h-[520px] flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt="铸造工厂"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Mobile: full dark overlay; Desktop: gradient to right */}
        <div className="absolute inset-0 bg-[#0d1b35]/80 md:bg-gradient-to-r md:from-[#0d1b35]/92 md:via-[#0d1b35]/65 md:to-[#0d1b35]/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-[#f97316]/20 border border-[#f97316]/40 text-[#f97316] text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse shrink-0" />
              专业铸件制造商 · 20年品质保障
            </div>

            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-4">
              精密铸造
              <br />
              <span className="text-[#f97316]">铸就品质</span>
            </h1>

            <p className="text-white/75 text-sm sm:text-base md:text-lg leading-relaxed mb-7 max-w-xl">
              专业生产灰铸铁、球墨铸铁、铸钢及铝合金铸件，服务全球工业制造业，年产能超过50,000吨。
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-[#f97316] text-white px-6 py-3.5 rounded font-semibold hover:bg-[#ea6c00] transition-all shadow-lg shadow-orange-500/30 text-sm sm:text-base"
              >
                查看产品
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 border border-white/50 text-white px-6 py-3.5 rounded font-semibold hover:bg-white/10 transition-all text-sm sm:text-base"
              >
                立即询价
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats ribbon — desktop only */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#0d1b35]/85 backdrop-blur-sm hidden md:block">
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-4 divide-x divide-white/10">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-4 px-6 first:pl-0">
                <div className="text-[#f97316]">{s.icon}</div>
                <div>
                  <div className="text-white text-xl font-black">{s.value}</div>
                  <div className="text-white/50 text-xs">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — mobile (2×2 grid below hero) */}
      <div className="md:hidden bg-[#1a2744] grid grid-cols-2 divide-x divide-y divide-white/10">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-4">
            <div className="text-[#f97316]">{s.icon}</div>
            <div>
              <div className="text-white text-lg font-black">{s.value}</div>
              <div className="text-white/50 text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ───── About Section ───── */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Image with badge — badge is relative on mobile, absolute on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative pb-6 md:pb-0"
          >
            <img
              src={aboutImg}
              alt="铸造生产"
              className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-xl"
            />
            {/* Badge: absolutely positioned on desktop; stacked below on mobile */}
            <div className="absolute bottom-0 right-0 md:-bottom-5 md:-right-5 bg-[#f97316] text-white p-4 rounded-lg shadow-lg">
              <div className="text-2xl md:text-3xl font-black">20+</div>
              <div className="text-xs md:text-sm">年专业铸造</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              关于我们
            </div>
            <h2 className="text-[#1a2744] text-2xl sm:text-3xl md:text-4xl font-black mb-4 leading-tight">
              中国领先的
              <br />
              精密铸件制造商
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3">
              上海铸造有限公司成立于2004年，是一家集研发、生产、销售于一体的专业铸件制造企业，坐落于上海市奉贤工业园区，占地面积约50,000平方米。
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5">
              公司拥有先进的铸造生产线和检测设备，年产能超过50,000吨，产品广泛应用于工程机械、汽车制造、电力设备、泵阀管道等多个工业领域，出口至欧美、东南亚30余个国家和地区。
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "通过ISO 9001:2015国际质量管理体系认证",
                "拥有完整的铸造、机加工、热处理生产线",
                "专业的研发团队，可提供定制化设计服务",
                "严格的出厂检验，确保100%合格率",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#f97316] shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[#f97316] font-semibold hover:gap-3 transition-all text-sm sm:text-base"
            >
              了解更多
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ───── Products Section ───── */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              产品中心
            </div>
            <h2 className="text-[#1a2744] text-2xl sm:text-3xl md:text-4xl font-black mb-2 md:mb-3">
              我们的主要产品
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              覆盖多种材质与工艺，满足不同工业场景需求
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product, i) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 text-2xl">{product.icon}</div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-[#1a2744] font-bold mb-1.5 sm:mb-2">{product.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3 sm:mb-4">{product.desc}</p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1 text-[#f97316] text-sm font-semibold hover:gap-2 transition-all"
                  >
                    了解详情 <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 border-2 border-[#1a2744] text-[#1a2744] px-6 sm:px-8 py-3 rounded font-semibold hover:bg-[#1a2744] hover:text-white transition-all text-sm sm:text-base"
            >
              查看全部产品
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Factory Banner ───── */}
      <section className="relative py-14 md:py-20 overflow-hidden">
        <img
          src={factoryImg}
          alt="生产线"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0d1b35]/82" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 md:mb-4">
            现代化工厂 · 先进制造
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto mb-7 md:mb-8">
            总面积50,000平方米，拥有多条自动化铸造生产线，配备先进三坐标检测仪、光谱分析仪等精密检测设备。
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-3xl mx-auto">
            {[
              { v: "50,000㎡", l: "厂房面积" },
              { v: "5条", l: "自动化生产线" },
              { v: "50,000吨", l: "年生产能力" },
              { v: "200+", l: "专业技术人员" },
            ].map((item) => (
              <div
                key={item.l}
                className="bg-white/10 backdrop-blur rounded-lg p-3 sm:p-4 border border-white/20"
              >
                <div className="text-[#f97316] text-lg sm:text-xl md:text-2xl font-black">{item.v}</div>
                <div className="text-white/60 text-xs mt-0.5 sm:mt-1">{item.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Advantages ───── */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              核心优势
            </div>
            <h2 className="text-[#1a2744] text-2xl sm:text-3xl md:text-4xl font-black mb-2">
              为什么选择我们
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {advantages.map((adv, i) => (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-5 sm:p-7 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex sm:block gap-4 items-start"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-orange-50 flex items-center justify-center text-[#f97316] shrink-0 sm:mb-5 group-hover:bg-[#f97316] group-hover:text-white transition-colors">
                  {adv.icon}
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

      {/* ───── Certifications ───── */}
      <section className="py-10 md:py-12 bg-[#1a2744]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <h3 className="text-white font-bold text-base sm:text-lg">权威认证 · 品质保障</h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {certifications.map((cert) => (
              <div
                key={cert}
                className="px-4 sm:px-6 py-2 border border-white/20 text-white/80 rounded-full text-xs sm:text-sm font-medium hover:border-[#f97316] hover:text-[#f97316] transition-colors cursor-default"
              >
                {cert}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[#1a2744] text-2xl sm:text-3xl md:text-4xl font-black mb-3 md:mb-4">
            准备好合作了吗？
          </h2>
          <p className="text-gray-500 mb-6 md:mb-8 text-sm sm:text-base md:text-lg">
            联系我们的销售团队，获取免费技术咨询和产品报价
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#f97316] text-white px-7 py-3.5 rounded font-semibold hover:bg-[#ea6c00] transition-all shadow-lg shadow-orange-500/30 text-sm sm:text-base"
            >
              获取报价
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <a
              href="tel:+862112345678"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#1a2744] text-[#1a2744] px-7 py-3.5 rounded font-semibold hover:bg-[#1a2744] hover:text-white transition-all text-sm sm:text-base"
            >
              电话咨询
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

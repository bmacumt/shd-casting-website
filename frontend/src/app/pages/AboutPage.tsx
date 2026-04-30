import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ChevronRight, Award, Users, Globe, Clock } from "lucide-react";
import { getSiteConfig } from "../utils/api";

const heroImg = "https://images.unsplash.com/photo-1764185800646-f75f7e16e465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWN0b3J5JTIwcHJvZHVjdGlvbiUyMGxpbmUlMjBtYW51ZmFjdHVyaW5nJTIwcGxhbnR8ZW58MXx8fHwxNzc3NDcxNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080";
const teamImg = "https://images.unsplash.com/photo-1748640857973-93524ef0fe7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVjaXNpb24lMjBlbmdpbmVlcmluZyUyMHdvcmtzaG9wJTIwQ05DJTIwbWFjaGluaW5nfGVufDF8fHx8MTc3NzQ3MTU2MHww&ixlib=rb-4.1.0&q=80&w=1080";

const milestones = [
  { year: "2004", title: "公司成立", desc: "上海铸造有限公司在上海奉贤区正式成立，首批员工50人。" },
  { year: "2007", title: "首次通过ISO认证", desc: "取得ISO 9001质量管理体系认证，质量管理走向规范化。" },
  { year: "2010", title: "产能突破10,000吨", desc: "新增生产线，年产能突破10,000吨，开始出口东南亚市场。" },
  { year: "2015", title: "欧美市场拓展", desc: "产品进入欧洲、北美市场，出口额占总营收40%以上。" },
  { year: "2019", title: "智能化升级", desc: "引进智能铸造生产线，自动化率达到75%，效率提升显著。" },
  { year: "2024", title: "20周年腾飞", desc: "年产能达50,000吨，员工超500人，服务全球30+国家客户。" },
];

const team = [
  { name: "张建国", title: "董事长 & 总经理", exp: "30年铸造行业经验" },
  { name: "李明华", title: "技术总监", exp: "高级工程师，发明专利12项" },
  { name: "王秀芳", title: "质量总监", exp: "ISO认证内审员，从业25年" },
  { name: "陈志远", title: "销售总监", exp: "海外市场拓展专家" },
];

const certs = [
  { name: "ISO 9001:2015", desc: "质量管理体系认证", icon: "🏅" },
  { name: "CE认证", desc: "欧洲产品合规认证", icon: "🇪🇺" },
  { name: "SGS检验", desc: "全球领先检测机构认证", icon: "✅" },
  { name: "BV检验", desc: "法国必维国际检验认证", icon: "🔍" },
  { name: "TÜV南德认证", desc: "德国技术监督协会认证", icon: "🇩🇪" },
  { name: "高新技术企业", desc: "国家高新技术企业认定", icon: "⭐" },
];

export function AboutPage() {
  const [cfg, setCfg] = useState<Record<string, string>>({});

  useEffect(() => {
    getSiteConfig().then(setCfg).catch(() => {});
  }, []);

  return (
    <div>
      {/* ───── Page Hero ───── */}
      <section className="relative h-44 sm:h-56 md:h-64 flex items-center">
        <img src={heroImg} alt="关于我们" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0d1b35]/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm mb-2 sm:mb-3">
            <Link to="/" className="hover:text-[#f97316] transition-colors">首页</Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-white">关于我们</span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black">关于我们</h1>
          <p className="text-white/70 mt-1 sm:mt-2 text-sm sm:text-base">
            专注铸造20年，铸就行业品质标杆
          </p>
        </div>
      </section>

      {/* ───── Company Intro ───── */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              公司简介
            </div>
            <h2 className="text-[#1a2744] text-2xl sm:text-3xl md:text-4xl font-black mb-4 md:mb-6 leading-tight">
              中国领先的
              <br />
              工业铸件制造商
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
              {cfg.company_intro || "上海铸造有限公司（SHD Casting Co., Ltd）成立于2004年，总部位于上海市奉贤区工业园区，是一家集铸件研发、设计、生产、机加工及热处理于一体的综合性制造企业。"}
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
              公司拥有现代化厂房{(cfg.factory_area || "50,000余")}平方米，员工500余人，其中专业技术人员200余人。公司装备有先进的自动化铸造生产线5条，配备三坐标测量机、直读光谱仪、超声波探伤仪等精密检测设备，年产能超过{(cfg.annual_capacity || "50,000")}吨。
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 md:mb-6">
              经过20年的发展，公司产品远销欧洲、北美、东南亚等{cfg.export_countries || "30余"}个国家和地区，与数十家世界500强企业建立了长期稳定的合作关系。
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Clock className="w-4 h-4" />, label: "成立于2004年", sub: `${cfg.years_experience || "20"}年行业深耕` },
                { icon: <Users className="w-4 h-4" />, label: `${cfg.clients_count || "500+"}合作客户`, sub: "专业技术团队" },
                { icon: <Globe className="w-4 h-4" />, label: `${cfg.export_countries || "30+"}出口国家`, sub: "全球化布局" },
                { icon: <Award className="w-4 h-4" />, label: "6项权威认证", sub: "品质保证体系" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="text-[#f97316] mt-0.5 shrink-0">{item.icon}</div>
                  <div>
                    <div className="text-[#1a2744] font-bold text-xs sm:text-sm">{item.label}</div>
                    <div className="text-gray-400 text-xs">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2"
          >
            <img
              src={teamImg}
              alt="工厂环境"
              className="w-full h-56 sm:h-72 md:h-[450px] object-cover rounded-xl shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ───── Milestones ───── */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-14">
            <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              发展历程
            </div>
            <h2 className="text-[#1a2744] text-2xl sm:text-3xl md:text-4xl font-black">20年奋斗历程</h2>
          </div>

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:block relative">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0" />
            <div className="grid grid-cols-6 gap-6 relative z-10">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1a2744] border-4 border-white shadow-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xs font-black">{m.year.slice(2)}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-[#f97316] font-black text-sm mb-1">{m.year}</div>
                    <div className="text-[#1a2744] font-bold text-sm mb-1">{m.title}</div>
                    <div className="text-gray-500 text-xs leading-relaxed">{m.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical timeline */}
          <div className="md:hidden relative pl-8">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="relative"
                >
                  <div className="absolute -left-8 top-0 w-8 h-8 rounded-full bg-[#1a2744] border-2 border-white shadow flex items-center justify-center">
                    <span className="text-white text-xs font-black">{m.year.slice(2)}</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-[#f97316] font-black text-sm mb-0.5">{m.year}</div>
                    <div className="text-[#1a2744] font-bold text-sm mb-1">{m.title}</div>
                    <div className="text-gray-500 text-xs leading-relaxed">{m.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── Team ───── */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              管理团队
            </div>
            <h2 className="text-[#1a2744] text-2xl sm:text-3xl md:text-4xl font-black">核心领导团队</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-5 sm:p-8 bg-gray-50 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#1a2744] mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                  <span className="text-[#f97316] text-xl sm:text-2xl font-black">{member.name[0]}</span>
                </div>
                <div className="text-[#1a2744] font-bold text-sm sm:text-base mb-0.5 sm:mb-1">{member.name}</div>
                <div className="text-[#f97316] text-xs sm:text-sm font-medium mb-1 sm:mb-2">{member.title}</div>
                <div className="text-gray-500 text-xs hidden sm:block">{member.exp}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Certifications ───── */}
      <section className="py-12 md:py-20 bg-[#1a2744]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              资质认证
            </div>
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black">权威认证</h2>
            <p className="text-white/60 mt-2 text-sm sm:text-base">多项国际权威认证，为您的选择保驾护航</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {certs.map((cert, i) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 hover:border-[#f97316]/50 hover:bg-white/10 rounded-xl p-4 sm:p-5 text-center transition-all"
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{cert.icon}</div>
                <div className="text-white font-bold text-xs sm:text-sm mb-0.5 sm:mb-1">{cert.name}</div>
                <div className="text-white/50 text-xs hidden sm:block">{cert.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[#1a2744] text-2xl sm:text-3xl font-black mb-3 md:mb-4">携手合作，共创未来</h2>
          <p className="text-gray-500 mb-6 md:mb-8 text-sm sm:text-base">我们期待与您建立长期稳定的合作关系</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#f97316] text-white px-7 py-3.5 rounded font-semibold hover:bg-[#ea6c00] transition-all shadow-lg shadow-orange-500/30 text-sm sm:text-base"
          >
            立即联系我们
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

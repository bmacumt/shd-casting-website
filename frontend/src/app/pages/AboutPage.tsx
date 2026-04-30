import { motion } from "motion/react";
import { Link } from "react-router";
import { ChevronRight, Award, Users, Globe, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSiteConfig } from "../utils/useSiteConfig";

const heroImg = "https://images.unsplash.com/photo-1764185800646-f75f7e16e465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWN0b3J5JTIwcHJvZHVjdGlvbiUyMGxpbmUlMjBtYW51ZmFjdHVyaW5nJTIwcGxhbnR8ZW58MXx8fHwxNzc3NDcxNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080";
const teamImg = "https://images.unsplash.com/photo-1748640857973-93524ef0fe7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVjaXNpb24lMjBlbmdpbmVlcmluZyUyMHdvcmtzaG9wJTIwQ05DJTIwbWFjaGluaW5nfGVufDF8fHx8MTc3NzQ3MTU2MHww&ixlib=rb-4.1.0&q=80&w=1080";

const defaultMilestones = [
  { year: "2004", title: "Company Founded", desc: "SHD Casting officially established in Fengxian District, Shanghai, with an initial team of 50 employees." },
  { year: "2007", title: "ISO Certification", desc: "Obtained ISO 9001 quality management system certification, marking a new era of standardized quality management." },
  { year: "2010", title: "Capacity Exceeded 10,000 Tons", desc: "Added new production lines. Annual capacity exceeded 10,000 tons. Began exporting to Southeast Asian markets." },
  { year: "2015", title: "European & American Markets", desc: "Products entered European and North American markets. Export revenue exceeded 40% of total revenue." },
  { year: "2019", title: "Smart Manufacturing Upgrade", desc: "Introduced intelligent casting production lines. Automation rate reached 75% with significantly improved efficiency." },
  { year: "2024", title: "20th Anniversary", desc: "Annual capacity reached 50,000 tons with 500+ employees, serving customers in over 30 countries worldwide." },
];

const defaultTeam = [
  { name: "Zhang Jianguo", title: "Chairman & General Manager", exp: "30 years of casting industry experience" },
  { name: "Li Minghua", title: "Technical Director", exp: "Senior engineer with 12 invention patents" },
  { name: "Wang Xiufang", title: "Quality Director", exp: "ISO certified internal auditor, 25 years of experience" },
  { name: "Chen Zhiyuan", title: "Sales Director", exp: "Overseas market expansion expert" },
];

const defaultCerts = [
  { name: "ISO 9001:2015", desc: "Quality Management System Certification", icon: "🏅" },
  { name: "CE Certification", desc: "European Product Compliance Certification", icon: "🇪🇺" },
  { name: "SGS Certification", desc: "World-leading Testing Organization Certification", icon: "✅" },
  { name: "BV Inspection", desc: "Bureau Veritas International Inspection Certification", icon: "🔍" },
  { name: "TÜV Certification", desc: "German Technical Supervision Association Certification", icon: "🇩🇪" },
  { name: "High-Tech Enterprise", desc: "National High-Tech Enterprise Certification", icon: "⭐" },
];

export function AboutPage() {
  const { t } = useTranslation();
  const { cfg, t: cfgT } = useSiteConfig();

  const milestonesJson = cfgT("milestones");
  const milestones = milestonesJson ? JSON.parse(milestonesJson) : defaultMilestones;
  const teamJson = cfgT("team");
  const team = teamJson ? JSON.parse(teamJson) : defaultTeam;
  const certsJson = cfgT("certifications");
  const certs = certsJson ? JSON.parse(certsJson) : defaultCerts;

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
            <span className="text-white">{t("nav.about")}</span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black">{t("about.title")}</h1>
          <p className="text-white/70 mt-1 sm:mt-2 text-sm sm:text-base">{t("about.subtitle")}</p>
        </div>
      </section>

      {/* Company Intro */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="order-2 md:order-1">
            <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              {t("about.intro_tag")}
            </div>
            <h2 className="text-[#1a2744] text-2xl sm:text-3xl md:text-4xl font-black mb-4 md:mb-6 leading-tight">
              {t("about.intro_title").split("\n").map((line, i) => (
                <span key={i}>{i > 0 && <br />}{line}</span>
              ))}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
              {cfgT("company_intro") || t("home.about_desc")}
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 md:mb-4">
              {t("home.about_desc2")}
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 md:mb-6">
              {t("home.about_desc2")}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Clock className="w-4 h-4" />, label: t("about.founded"), sub: `${cfg.years_experience || "20"}${t("about.deep_experience")}` },
                { icon: <Users className="w-4 h-4" />, label: `${cfg.clients_count || "500+"}`, sub: t("about.team_label") },
                { icon: <Globe className="w-4 h-4" />, label: `${cfg.export_countries || "30+"}`, sub: t("about.global_label") },
                { icon: <Award className="w-4 h-4" />, label: "6", sub: t("about.quality_label") },
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

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="order-1 md:order-2">
            <img src={teamImg} alt="" className="w-full h-56 sm:h-72 md:h-[450px] object-cover rounded-xl shadow-xl" />
          </motion.div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-14">
            <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              {t("about.milestones_tag")}
            </div>
            <h2 className="text-[#1a2744] text-2xl sm:text-3xl md:text-4xl font-black">{t("about.milestones_title")}</h2>
          </div>

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:block relative">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0" />
            <div className="grid grid-cols-6 gap-6 relative z-10">
              {milestones.map((m: any, i: number) => (
                <motion.div key={m.year} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex flex-col items-center">
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
              {milestones.map((m: any, i: number) => (
                <motion.div key={m.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="relative">
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

      {/* Team */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              {t("about.team_tag")}
            </div>
            <h2 className="text-[#1a2744] text-2xl sm:text-3xl md:text-4xl font-black">{t("about.team_title")}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {team.map((member: any, i: number) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-5 sm:p-8 bg-gray-50 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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

      {/* Certifications */}
      <section className="py-12 md:py-20 bg-[#1a2744]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-[#f97316] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
              {t("about.certs_tag")}
            </div>
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black">{t("about.certs_title")}</h2>
            <p className="text-white/60 mt-2 text-sm sm:text-base">{t("about.certs_subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {certs.map((cert: any, i: number) => (
              <motion.div key={cert.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 hover:border-[#f97316]/50 hover:bg-white/10 rounded-xl p-4 sm:p-5 text-center transition-all">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{cert.icon}</div>
                <div className="text-white font-bold text-xs sm:text-sm mb-0.5 sm:mb-1">{cert.name}</div>
                <div className="text-white/50 text-xs hidden sm:block">{cert.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[#1a2744] text-2xl sm:text-3xl font-black mb-3 md:mb-4">{t("about.cta_title")}</h2>
          <p className="text-gray-500 mb-6 md:mb-8 text-sm sm:text-base">{t("about.cta_subtitle")}</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-[#f97316] text-white px-7 py-3.5 rounded font-semibold hover:bg-[#ea6c00] transition-all shadow-lg shadow-orange-500/30 text-sm sm:text-base">
            {t("about.cta_button")} <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

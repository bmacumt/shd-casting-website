import { Phone, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

export function MobileFloatingBar() {
  const { t } = useTranslation();
  const location = useLocation();
  if (location.pathname === "/contact") return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.10)] safe-area-inset-bottom">
      <div className="flex divide-x divide-gray-200">
        <a
          href="tel:+862112345678"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-gray-600 active:bg-gray-50 transition-colors"
        >
          <Phone className="w-5 h-5 text-[#f97316]" />
          <span className="text-xs font-medium">{t("mobile_bar.phone")}</span>
        </a>

        <Link
          to="/contact"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 bg-[#f97316] text-white active:bg-[#ea6c00] transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs font-medium">{t("mobile_bar.inquiry")}</span>
        </Link>
      </div>
      <div className="h-safe-bottom bg-white" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
    </div>
  );
}

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getSiteConfig } from "./api";

export function useSiteConfig() {
  const { i18n } = useTranslation();
  const [cfg, setCfg] = useState<Record<string, string>>({});
  const lang = i18n.language;

  useEffect(() => { getSiteConfig().then(setCfg).catch(() => {}); }, []);

  const t = (key: string) => {
    if (lang !== 'zh') {
      const v = cfg[`${key}_${lang}`];
      if (v) return v;
    }
    return cfg[key] || '';
  };

  return { cfg, t, lang };
}

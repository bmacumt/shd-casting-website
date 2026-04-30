import { useState, useEffect } from "react";
import { getSiteConfig } from "./api";

export function useSiteConfig() {
  const [cfg, setCfg] = useState<Record<string, string>>({});
  useEffect(() => { getSiteConfig().then(setCfg).catch(() => {}); }, []);
  return cfg;
}

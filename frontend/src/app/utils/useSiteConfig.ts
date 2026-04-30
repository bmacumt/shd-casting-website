import { useState, useEffect, useMemo } from "react";
import { getSiteConfig } from "./api";

export function useSiteConfig() {
  const [cfg, setCfg] = useState<Record<string, string>>({});

  useEffect(() => { getSiteConfig().then(setCfg).catch(() => {}); }, []);

  const t = useMemo(() => (key: string) => cfg[key] || '', [cfg]);

  return { cfg, t };
}

import { useState, useEffect } from "react";
import { adminDashboardStats } from "../../utils/api";
import type { DashboardStats } from "../../utils/api";

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminDashboardStats().then(setStats).catch(() => {});
  }, []);

  if (!stats) return <div className="text-gray-400">加载中…</div>;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "今日询价", value: stats.today_inquiries, color: "bg-blue-50 text-blue-600" },
          { label: "本月询价", value: stats.month_inquiries, color: "bg-green-50 text-green-600" },
          { label: "总询价数", value: stats.total_inquiries, color: "bg-purple-50 text-purple-600" },
          { label: "待处理", value: stats.pending_count, color: "bg-orange-50 text-orange-600" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${card.color} text-lg font-bold mb-3`}>
              {card.value}
            </div>
            <div className="text-gray-500 text-sm">{card.label}</div>
          </div>
        ))}
      </div>

      {/* 7-day Trend */}
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h3 className="font-bold text-[#1a2744] mb-4">近7天询价趋势</h3>
        <div className="flex items-end gap-2 h-40">
          {stats.trend.map((item) => {
            const max = Math.max(...stats.trend.map((t) => t.count), 1);
            const height = (item.count / max) * 100;
            return (
              <div key={item.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">{item.count}</span>
                <div className="w-full bg-[#f97316]/20 rounded-t" style={{ height: `${Math.max(height, 4)}%` }}>
                  <div className="w-full bg-[#f97316] rounded-t transition-all" style={{ height: "100%" }} />
                </div>
                <span className="text-[10px] text-gray-400">{item.date.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Distribution */}
      {stats.category_distribution.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="font-bold text-[#1a2744] mb-4">产品类别分布</h3>
          <div className="space-y-3">
            {stats.category_distribution.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.category}</span>
                  <span className="text-gray-400">{item.count} 条 ({item.percentage}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-[#f97316] rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

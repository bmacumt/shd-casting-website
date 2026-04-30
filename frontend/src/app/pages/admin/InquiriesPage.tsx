import { useState, useEffect } from "react";
import { adminGetInquiries, adminUpdateInquiry, adminDeleteInquiry } from "../../utils/api";
import type { InquiryDetail, InquiryStats } from "../../utils/api";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "待处理", color: "bg-yellow-100 text-yellow-700" },
  processing: { label: "处理中", color: "bg-blue-100 text-blue-700" },
  replied: { label: "已回复", color: "bg-green-100 text-green-700" },
  closed: { label: "已关闭", color: "bg-gray-100 text-gray-500" },
};

export function InquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryDetail[]>([]);
  const [stats, setStats] = useState<InquiryStats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [keyword, setSearch] = useState("");

  const load = () => {
    const params: Record<string, string> = { page: String(page), pageSize: "20" };
    if (statusFilter) params.status = statusFilter;
    if (keyword) params.keyword = keyword;
    adminGetInquiries(params).then((data) => {
      setInquiries(data.list);
      setTotal(data.total);
      setStats(data.stats);
    }).catch(() => {});
  };

  useEffect(() => { load(); }, [page, statusFilter]);

  const handleStatus = async (id: number, status: string) => {
    await adminUpdateInquiry(id, { status });
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除此询价？")) return;
    await adminDeleteInquiry(id);
    load();
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "全部", value: stats.total, active: !statusFilter, key: "" },
            { label: "待处理", value: stats.pending, active: statusFilter === "pending", key: "pending" },
            { label: "处理中", value: stats.processing, active: statusFilter === "processing", key: "processing" },
            { label: "已回复", value: stats.replied, active: statusFilter === "replied", key: "replied" },
            { label: "已关闭", value: stats.closed, active: statusFilter === "closed", key: "closed" },
          ].map((s) => (
            <button key={s.key} onClick={() => { setStatusFilter(s.key); setPage(1); }}
              className={`p-3 rounded-lg text-center transition-colors ${s.active ? "bg-[#f97316] text-white" : "bg-white border border-gray-100 hover:border-[#f97316]"}`}>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs mt-0.5 opacity-80">{s.label}</div>
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="flex gap-3">
        <input value={keyword} onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索姓名/公司/邮箱…" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/30" />
        <button onClick={load} className="px-4 py-2.5 bg-[#1a2744] text-white rounded-lg text-sm">搜索</button>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-3">编号</th>
              <th className="text-left px-4 py-3">客户</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">公司</th>
              <th className="text-left px-4 py-3">产品类别</th>
              <th className="text-left px-4 py-3">状态</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">时间</th>
              <th className="text-left px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {inquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{inq.inquiry_id}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-[#1a2744]">{inq.name}</div>
                  <div className="text-gray-400 text-xs">{inq.email}</div>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{inq.company || "-"}</td>
                <td className="px-4 py-3 text-gray-500">{inq.product_category || "-"}</td>
                <td className="px-4 py-3">
                  <select value={inq.status} onChange={(e) => handleStatus(inq.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full border-0 ${STATUS_MAP[inq.status]?.color || ""}`}>
                    {Object.entries(STATUS_MAP).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{new Date(inq.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(inq.id)} className="text-red-400 hover:text-red-600 text-xs">删除</button>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">暂无询价数据</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 border rounded text-sm disabled:opacity-40">上一页</button>
          <span className="px-3 py-1.5 text-sm text-gray-500">第 {page} 页 / 共 {Math.ceil(total / 20)} 页</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(page + 1)} className="px-3 py-1.5 border rounded text-sm disabled:opacity-40">下一页</button>
        </div>
      )}
    </div>
  );
}

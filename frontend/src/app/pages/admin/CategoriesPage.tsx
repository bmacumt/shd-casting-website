import { useState, useEffect } from "react";
import { getCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from "../../utils/api";
import type { Category } from "../../utils/api";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Category> & { name_en?: string } & { id?: number } | null>(null);

  const load = () => { getCategories().then(setCategories).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing({ name: "", name_en: "", sort_order: categories.length + 1 }); setShowForm(true); };
  const openEdit = (c: Category) => { setEditing({ ...c, name_en: "" }); setShowForm(true); };

  const handleSave = async () => {
    if (!editing?.name) return;
    if (editing.id) {
      await adminUpdateCategory(editing.id, { name: editing.name, sort_order: editing.sort_order });
    } else {
      await adminCreateCategory({ name: editing.name, name_en: editing.name_en, sort_order: editing.sort_order || 0 });
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除此分类？")) return;
    try {
      await adminDeleteCategory(id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除失败");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">共 {categories.length} 个分类</span>
        <button onClick={openNew} className="px-4 py-2 bg-[#f97316] text-white rounded-lg text-sm font-medium hover:bg-[#ea6c00]">添加分类</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">分类名称</th>
              <th className="text-left px-4 py-3">产品数</th>
              <th className="text-left px-4 py-3">排序</th>
              <th className="text-left px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{c.id}</td>
                <td className="px-4 py-3 font-medium text-[#1a2744]">{c.name}</td>
                <td className="px-4 py-3 text-gray-500">{c.product_count}</td>
                <td className="px-4 py-3 text-gray-500">{c.sort_order}</td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => openEdit(c)} className="text-blue-500 hover:text-blue-700 text-xs">编辑</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-600 text-xs">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-[#1a2744] text-lg mb-4">{editing.id ? "编辑分类" : "添加分类"}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">分类名称 *</label>
                <input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">英文名称</label>
                <input value={editing.name_en || ""} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">排序</label>
                <input type="number" value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} className="flex-1 py-2.5 bg-[#f97316] text-white rounded-lg font-medium hover:bg-[#ea6c00]">保存</button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-500">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { getCategories, getProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminUploadImage } from "../../utils/api";
import type { Product, Category } from "../../utils/api";

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const result = await adminUploadImage(file);
      onChange(result.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {value ? (
        <div className="relative group">
          <img src={value} alt="封面" className="w-full h-36 object-cover rounded-lg border border-gray-200" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <button onClick={() => inputRef.current?.click()} className="px-3 py-1.5 bg-white text-gray-700 rounded text-xs font-medium hover:bg-gray-100">
              更换图片
            </button>
            <button onClick={() => onChange("")} className="px-3 py-1.5 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600">
              删除
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="w-full h-36 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#f97316] hover:bg-orange-50/50 transition-colors"
        >
          {uploading ? (
            <span className="text-gray-400 text-sm">上传中…</span>
          ) : (
            <>
              <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-gray-400 text-sm">点击上传或拖拽图片到此处</span>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg text-sm mt-2"
        placeholder="或直接输入图片URL…"
      />
    </div>
  );
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Partial<Product> & { id?: number } | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    getProducts({ page, pageSize: 20 }).then((d) => { setProducts(d.list); setTotal(d.total); }).catch(() => {});
    getCategories().then(setCategories).catch(() => {});
  };

  useEffect(() => { load(); }, [page]);

  const openNew = () => {
    setEditing({ name: "", category_id: categories[0]?.id, is_active: true, is_featured: false, sort_order: 0 });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing({ ...p, category_id: p.category?.id });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!editing?.name || !editing?.category_id) return;
    const data = {
      name: editing.name!,
      category_id: editing.category_id!,
      material: editing.material || undefined,
      weight_range: editing.weight_range || undefined,
      standard: editing.standard || undefined,
      description: editing.description || undefined,
      cover_image: editing.cover_image || undefined,
      tag: editing.tag || undefined,
      is_featured: !!editing.is_featured,
      is_active: editing.is_active !== false,
      sort_order: editing.sort_order || 0,
    };
    if (editing.id) {
      await adminUpdateProduct(editing.id, data);
    } else {
      await adminCreateProduct(data as any);
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除此产品？")) return;
    await adminDeleteProduct(id);
    load();
  };

  const catName = (id?: number) => categories.find((c) => c.id === id)?.name || "-";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">共 {total} 个产品</span>
        <button onClick={openNew} className="px-4 py-2 bg-[#f97316] text-white rounded-lg text-sm font-medium hover:bg-[#ea6c00]">添加产品</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-3">产品名称</th>
              <th className="text-left px-4 py-3">分类</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">材质</th>
              <th className="text-left px-4 py-3">状态</th>
              <th className="text-left px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.cover_image && <img src={p.cover_image} alt="" className="w-10 h-10 rounded object-cover" />}
                    <div>
                      <div className="font-medium text-[#1a2744]">{p.name}</div>
                      {p.tag && <span className="text-[10px] bg-[#f97316]/10 text-[#f97316] px-1.5 py-0.5 rounded">{p.tag}</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{catName(p.category?.id)}</td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.material || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                    {p.is_active ? "上架" : "下架"}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => openEdit(p)} className="text-blue-500 hover:text-blue-700 text-xs">编辑</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600 text-xs">删除</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-gray-400">暂无产品</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {showForm && editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-[#1a2744] text-lg mb-4">{editing.id ? "编辑产品" : "添加产品"}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">产品名称 *</label>
                <input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">分类 *</label>
                  <select value={editing.category_id || ""} onChange={(e) => setEditing({ ...editing, category_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg text-sm">
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">材质</label>
                  <input value={editing.material || ""} onChange={(e) => setEditing({ ...editing, material: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">重量范围</label>
                  <input value={editing.weight_range || ""} onChange={(e) => setEditing({ ...editing, weight_range: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">执行标准</label>
                  <input value={editing.standard || ""} onChange={(e) => setEditing({ ...editing, standard: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">封面图片</label>
                <ImageUploader
                  value={editing.cover_image || ""}
                  onChange={(url) => setEditing({ ...editing, cover_image: url })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">产品描述</label>
                <textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3} className="w-full px-3 py-2 border rounded-lg text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">标签</label>
                  <input value={editing.tag || ""} onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="热销/新品/精品" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">排序</label>
                  <input type="number" value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!editing.is_featured} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} />
                  首页推荐
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.is_active !== false} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
                  上架
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} className="flex-1 py-2.5 bg-[#f97316] text-white rounded-lg font-medium hover:bg-[#ea6c00]">保存</button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, { headers, ...options });
  const data = await res.json();
  if (data.code !== 200) {
    throw new Error(data.message || '请求失败');
  }
  return data.data as T;
}

// ─── Public APIs ───

export interface InquiryForm {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  product_category?: string;
  quantity?: string;
  message: string;
}

export function submitInquiry(form: InquiryForm) {
  return request<{ inquiry_id: string; created_at: string }>('/inquiries', {
    method: 'POST',
    body: JSON.stringify(form),
  });
}

export function getProducts(params?: Record<string, string | number>) {
  const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
  return request<{ list: Product[]; total: number; page: number; pageSize: number; totalPages: number }>(`/products${query}`);
}

export function getProduct(id: number) {
  return request<Product>(`/products/${id}`);
}

export function getFeaturedProducts() {
  return request<Product[]>('/products/featured');
}

export function getCategories() {
  return request<Category[]>('/categories');
}

export function getSiteConfig() {
  return request<Record<string, string>>('/site-config');
}

// ─── Admin Auth ───

export function adminLogin(username: string, password: string) {
  return request<{ token: string; expires_in: number; admin: { id: number; username: string; role: string } }>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function adminLogout() {
  return request('/admin/logout', { method: 'POST' });
}

// ─── Admin Inquiries ───

export function adminGetInquiries(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return request<{ list: InquiryDetail[]; total: number; page: number; pageSize: number; stats: InquiryStats }>(`/admin/inquiries${query}`);
}

export function adminGetInquiry(id: number) {
  return request<InquiryDetail>(`/admin/inquiries/${id}`);
}

export function adminUpdateInquiry(id: number, data: { status: string; admin_note?: string }) {
  return request(`/admin/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function adminDeleteInquiry(id: number) {
  return request(`/admin/inquiries/${id}`, { method: 'DELETE' });
}

// ─── Admin Dashboard ───

export function adminDashboardStats() {
  return request<DashboardStats>('/admin/dashboard/stats');
}

// ─── Admin Products ───

export function adminCreateProduct(data: Partial<Product> & { name: string; category_id: number }) {
  return request<{ id: number }>('/admin/products', { method: 'POST', body: JSON.stringify(data) });
}

export function adminUpdateProduct(id: number, data: Partial<Product>) {
  return request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function adminDeleteProduct(id: number) {
  return request(`/admin/products/${id}`, { method: 'DELETE' });
}

export function adminBatchUpdateProducts(ids: number[], is_active: boolean) {
  return request('/admin/products/batch', { method: 'PATCH', body: JSON.stringify({ ids, is_active }) });
}

// ─── Admin Categories ───

export function adminCreateCategory(data: { name: string; name_en?: string; sort_order?: number }) {
  return request<{ id: number }>('/admin/categories', { method: 'POST', body: JSON.stringify(data) });
}

export function adminUpdateCategory(id: number, data: { name?: string; name_en?: string; sort_order?: number }) {
  return request(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function adminDeleteCategory(id: number) {
  return request(`/admin/categories/${id}`, { method: 'DELETE' });
}

// ─── Admin Site Config ───

export function adminUpdateSiteConfig(config: Record<string, string>) {
  return request('/admin/site-config', { method: 'PUT', body: JSON.stringify({ config }) });
}

// ─── Admin Upload ───

export async function adminUploadImage(file: File): Promise<{ url: string; filename: string }> {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/admin/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (data.code !== 200) {
    throw new Error(data.message || '上传失败');
  }
  return data.data as { url: string; filename: string };
}

// ─── Types ───

export interface Category {
  id: number;
  name: string;
  name_en?: string;
  name_es?: string;
  name_ru?: string;
  sort_order: number;
  product_count: number;
}

export interface Product {
  id: number;
  name: string;
  name_en?: string;
  name_es?: string;
  name_ru?: string;
  category?: Category;
  category_id?: number;
  material?: string;
  weight_range?: string;
  standard?: string;
  description?: string;
  cover_image?: string;
  images?: string[];
  tag?: string;
  is_featured?: boolean;
  is_active?: boolean;
  sort_order?: number;
  created_at?: string;
  related_products?: { id: number; name: string; cover_image?: string }[];
}

export interface InquiryDetail {
  id: number;
  inquiry_id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  product_category?: string;
  quantity?: string;
  message: string;
  status: string;
  created_at: string;
}

export interface InquiryStats {
  total: number;
  pending: number;
  processing: number;
  replied: number;
  closed: number;
}

export interface DashboardStats {
  today_inquiries: number;
  month_inquiries: number;
  total_inquiries: number;
  pending_count: number;
  trend: { date: string; count: number }[];
  category_distribution: { category: string; count: number; percentage: number }[];
}

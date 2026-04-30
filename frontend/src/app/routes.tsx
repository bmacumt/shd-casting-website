import { createBrowserRouter, useRouteError, isRouteErrorResponse } from "react-router";
import { Root } from "./Root";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminLoginPage } from "./pages/admin/LoginPage";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { InquiriesPage } from "./pages/admin/InquiriesPage";
import { AdminProductsPage } from "./pages/admin/ProductsPage";
import { CategoriesPage } from "./pages/admin/CategoriesPage";
import { SiteConfigPage } from "./pages/admin/SiteConfigPage";

function ErrorBoundary() {
  const error = useRouteError();
  let msg = "Unknown error";
  if (isRouteErrorResponse(error)) {
    msg = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    msg = error.message;
  }
  console.error("Route error:", error);
  return (
    <div style={{ padding: 40, fontFamily: "monospace" }}>
      <h1>Error</h1>
      <pre>{msg}</pre>
      <p>Check browser console for details.</p>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "products", Component: ProductsPage },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
    ],
  },
  {
    path: "/admin/login",
    Component: AdminLoginPage,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "dashboard", Component: DashboardPage },
      { path: "inquiries", Component: InquiriesPage },
      { path: "products", Component: AdminProductsPage },
      { path: "categories", Component: CategoriesPage },
      { path: "site-config", Component: SiteConfigPage },
    ],
  },
  {
    path: "*",
    element: <div style={{ padding: 40, textAlign: "center" }}><h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p></div>,
  },
]);

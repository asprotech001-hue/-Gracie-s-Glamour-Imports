import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ===========================
   WEBSITE
=========================== */

import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Product from "../pages/Product";
import About from "../pages/About";
import Contact from "../pages/Contact";

/* ===========================
   ADMIN
=========================== */

import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import CategoryManager from "../pages/admin/CategoryManager";
import SubcategoryManager from "../pages/admin/SubcategoryManager";
import Settings from "../pages/admin/Settings";
import ProtectedRoute from "../components/admin/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= WEBSITE ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route path="/product/:id" element={<Product />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        {/* ================= ADMIN ================= */}

        <Route path="/admin" element={<Login />} />

        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <CategoryManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/subcategories"
          element={
            <ProtectedRoute>
              <SubcategoryManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

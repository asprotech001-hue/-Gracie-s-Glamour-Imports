import {
  LayoutDashboard,
  Package,
  Shapes,
  Layers,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabase";

const menu = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: Shapes,
  },
  {
    name: "Subcategories",
    path: "/admin/subcategories",
    icon: Layers,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <aside className="w-64 bg-black text-white flex flex-col h-screen">

      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-yellow-400">
          Gracie's
        </h1>

        <p className="text-gray-400 text-sm">
          Glamour Admin
        </p>
      </div>

      <nav className="flex-1 px-4">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg mb-2 ${
                  isActive
                    ? "bg-yellow-500 text-black font-semibold"
                    : "hover:bg-zinc-800"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 p-4 hover:bg-red-600"
      >
        <LogOut size={20} />
        Logout
      </button>

    </aside>
  );
}

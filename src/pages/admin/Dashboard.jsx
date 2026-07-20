import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { dashboardStats } from "../../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    try {
      const data = await dashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <AdminLayout>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white rounded-xl p-6 shadow">

          <h3 className="text-gray-500">
            Products
          </h3>

          <h1 className="text-4xl font-bold mt-3">
            {loading ? "..." : stats.products}
          </h1>

        </div>

        <div className="bg-white rounded-xl p-6 shadow">

          <h3 className="text-gray-500">
            Categories
          </h3>

          <h1 className="text-4xl font-bold mt-3">
            {loading ? "..." : stats.categories}
          </h1>

        </div>

        <div className="bg-white rounded-xl p-6 shadow">

          <h3 className="text-gray-500">
            Orders
          </h3>

          <h1 className="text-4xl font-bold mt-3">
            {loading ? "..." : stats.orders}
          </h1>

        </div>

        <div className="bg-white rounded-xl p-6 shadow">

          <h3 className="text-gray-500">
            Revenue
          </h3>

          <h1 className="text-4xl font-bold mt-3">
            GH₵0
          </h1>

        </div>

      </div>

    </AdminLayout>
  );
}

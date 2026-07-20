import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getCategories,
  getSubcategories,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../../services/api";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

export default function SubcategoryManager() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const emptyForm = { name: "", category_id: "" };
  const [form, setForm] = useState(emptyForm);

  async function load() {
    setLoading(true);

    try {
      const [subData, catData] = await Promise.all([
        getSubcategories(),
        getCategories(),
      ]);

      setSubcategories(subData);
      setCategories(catData);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function newSubcategory() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function editSubcategory(sub) {
    setEditing(sub.id);
    setForm({
      name: sub.name || "",
      category_id: sub.category_id || "",
    });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this subcategory?")) return;

    try {
      await deleteSubcategory(id);
      toast.success("Subcategory deleted");
      load();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Subcategory name is required");
      return;
    }

    if (!form.category_id) {
      toast.error("Please select a parent category");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        category_id: Number(form.category_id),
      };

      if (editing) {
        await updateSubcategory(editing, payload);
        toast.success("Subcategory updated");
      } else {
        await addSubcategory(payload);
        toast.success("Subcategory added");
      }

      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);

      load();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  function categoryName(categoryId) {
    const match = categories.find(
      (c) => String(c.id) === String(categoryId)
    );
    return match?.name || "—";
  }

  const filtered = subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Subcategories</h1>

        <button
          onClick={newSubcategory}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          Add Subcategory
        </button>
      </div>

      <input
        type="text"
        placeholder="Search subcategory..."
        className="border p-3 rounded-lg w-80 mb-5"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Parent Category</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center p-10">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-10 text-gray-500">
                  No Subcategories Found
                </td>
              </tr>
            ) : (
              filtered.map((sub) => (
                <tr key={sub.id} className="border-t">
                  <td className="p-4 font-semibold">{sub.name}</td>

                  <td className="p-4 text-gray-600">
                    {categoryName(sub.category_id)}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => editSubcategory(sub)}>
                        <Pencil size={18} className="text-blue-600" />
                      </button>

                      <button onClick={() => handleDelete(sub.id)}>
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="bg-white w-full md:w-[420px] h-full overflow-y-auto p-6">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editing ? "Edit Subcategory" : "Add Subcategory"}
              </h2>

              <button onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-4">

              <input
                name="name"
                value={form.name}
                onChange={change}
                placeholder="Subcategory Name"
                className="w-full border rounded-lg p-3"
              />

              <select
                name="category_id"
                value={form.category_id}
                onChange={change}
                className="w-full border rounded-lg p-3"
              >
                <option value="">Select Parent Category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 border rounded-lg py-3 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg py-3 disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editing
                    ? "Update Subcategory"
                    : "Save Subcategory"}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
}

import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  BUCKETS,
} from "../../services/api";
import { supabase } from "../../supabase/supabase";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const emptyForm = { name: "", image: "" };
  const [form, setForm] = useState(emptyForm);

  async function loadCategories() {
    setLoading(true);

    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function newCategory() {
    setEditing(null);
    setImageFile(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function editCategory(category) {
    setEditing(category.id);
    setImageFile(null);
    setForm({
      name: category.name || "",
      image: category.image || "",
    });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      loadCategories();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  async function uploadCategoryImage(file) {
    const filename = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from(BUCKETS.CATEGORIES)
      .upload(filename, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from(BUCKETS.CATEGORIES)
      .getPublicUrl(filename);

    return data.publicUrl;
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);

      let image = form.image;

      if (imageFile) {
        image = await uploadCategoryImage(imageFile);
      }

      const payload = { name: form.name, image };

      if (editing) {
        await updateCategory(editing, payload);
        toast.success("Category updated");
      } else {
        await addCategory(payload);
        toast.success("Category added");
      }

      setShowForm(false);
      setEditing(null);
      setImageFile(null);
      setForm(emptyForm);

      loadCategories();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>

        <button
          onClick={newCategory}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <input
        type="text"
        placeholder="Search category..."
        className="border p-3 rounded-lg w-80 mb-5"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Name</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id} className="border-t">
                <td className="p-4">
                  <img
                    src={category.image || "https://placehold.co/64x64"}
                    alt={category.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </td>

                <td className="p-4 font-semibold">
                  {category.name}
                </td>

                <td className="p-4">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => editCategory(category)}>
                      <Pencil size={18} className="text-blue-600" />
                    </button>

                    <button onClick={() => handleDelete(category.id)}>
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-10 text-gray-500">
                  No Categories Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="bg-white w-full md:w-[420px] h-full overflow-y-auto p-6">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editing ? "Edit Category" : "Add Category"}
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
                placeholder="Category Name"
                className="w-full border rounded-lg p-3"
              />

              <div>
                <label className="font-medium block mb-2">
                  Category Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />

                {(imageFile || form.image) && (
                  <img
                    src={
                      imageFile
                        ? URL.createObjectURL(imageFile)
                        : form.image
                    }
                    alt="preview"
                    className="w-24 h-24 rounded-lg object-cover mt-3"
                  />
                )}
              </div>

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
                    ? "Update Category"
                    : "Save Category"}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
}

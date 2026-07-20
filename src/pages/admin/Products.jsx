import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getProducts,
  getCategories,
  getSubcategories,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  saveImages,
} from "../../services/api";

import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editing, setEditing] = useState(null);

  const [images, setImages] = useState([]);

  const emptyForm = {
    name: "",
    description: "",
    price: "",
    old_price: "",
    stock: 0,
    category_id: "",
    subcategory_id: "",
    featured: false,
    new_arrival: false,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    load();
  }, []);

  async function load() {
  setLoading(true);

  try {
    const productData = await getProducts();
    const categoryData = await getCategories();

    setProducts(productData);
    setCategories(categoryData);

  } catch (err) {
    console.error(err);
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
}
  async function loadSub(categoryId) {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    try {
      const data = await getSubcategories(categoryId);
      setSubcategories(data);
    } catch (err) {
      console.error(err);
    }
  }

  function change(e) {
    const { name, value, type, checked } = e.target;

    let newValue;

    if (type === "checkbox") {
      newValue = checked;
    } else {
      newValue = value;
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "category_id") {
      loadSub(value);
    }
  }

  function newProduct() {
    setEditing(null);
    setImages([]);
    setSubcategories([]);
    setForm(emptyForm);
    setShowForm(true);
  }

  async function edit(product) {
    setEditing(product.id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      old_price: product.old_price || "",
      stock: product.stock ?? 0,
      category_id: product.category_id || "",
      subcategory_id: product.subcategory_id || "",
      featured: product.featured || false,
      new_arrival: product.new_arrival || false,
    });

    if (product.category_id) {
      await loadSub(product.category_id);
    }

    setImages([]);
    setShowForm(true);
  }

  async function remove(id) {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProduct(id);

      toast.success("Product deleted");

      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSave() {
    try {
      setLoading(true);

      const payload = {
        ...form,
        category_id: form.category_id
          ? Number(form.category_id)
          : null,

        subcategory_id: form.subcategory_id
          ? Number(form.subcategory_id)
          : null,

        price: Number(form.price),

        old_price:
          form.old_price === ""
            ? null
            : Number(form.old_price),

        stock: Number(form.stock),
      };

      let productId;

      if (editing) {
        await updateProduct(editing, payload);
        productId = editing;
      } else {
        const product = await addProduct(payload);
        productId = product.id;
      }

      if (images.length > 0) {
        const urls = await uploadImages(images);
        await saveImages(productId, urls);
      }

      toast.success(
        editing
          ? "Product Updated"
          : "Product Added"
      );

      setShowForm(false);

      setEditing(null);

      setImages([]);

      setForm(emptyForm);

      load();

    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }
    return (
    <AdminLayout>
      <div className="p-6">

        {/* Header */}

        <div className="flex justify-between items-center mb-6">

          <div>
            <h1 className="text-3xl font-bold">
              Products
            </h1>

            <p className="text-gray-500">
              Manage your store products
            </p>
          </div>

          <button
            onClick={newProduct}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} />
            Add Product
          </button>

        </div>

        {/* Search */}

        <div className="relative mb-6">

          <Search
            size={18}
            className="absolute left-4 top-4 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full border rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
          />

        </div>

        {/* Products Table */}

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">
                  Image
                </th>

                <th className="text-left">
                  Product
                </th>

                <th>
                  Category
                </th>

                <th>
                  Price
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center p-10"
                  >
                    Loading Products...
                  </td>

                </tr>

              ) : filtered.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center p-10 text-gray-500"
                  >
                    No Products Found
                  </td>

                </tr>

              ) : (

                filtered.map((product) => (

                  <tr
                    key={product.id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-4">

                      <img
                        src={
                          product.product_images?.[0]?.image_url ||
                          "https://placehold.co/80x80?text=No+Image"
                        }
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />

                    </td>

                    <td>

                      <div className="font-semibold">
                        {product.name}
                      </div>

                      <div className="text-xs text-gray-500">
                        {product.description}
                      </div>

                    </td>

                    <td>

                      {product.categories?.name || "-"}

                    </td>

                    <td>

                      <span className="font-semibold text-green-700">
                        GH₵ {product.price}
                      </span>

                      {product.old_price && (

                        <div className="text-sm text-gray-400 line-through">
                          GH₵ {product.old_price}
                        </div>

                      )}

                    </td>

                    <td>

                      {product.stock}

                    </td>

                    <td>

                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() => edit(product)}
                          className="p-2 rounded hover:bg-blue-100"
                        >
                          <Pencil
                            size={18}
                            className="text-blue-600"
                          />
                        </button>

                        <button
                          onClick={() => remove(product.id)}
                          className="p-2 rounded hover:bg-red-100"
                        >
                          <Trash2
                            size={18}
                            className="text-red-600"
                          />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>
              {/* Add / Edit Drawer */}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">

          <div className="bg-white w-full md:w-[520px] h-full overflow-y-auto p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                {editing ? "Edit Product" : "Add Product"}
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X />
              </button>

            </div>

            <div className="space-y-4">

              <input
                name="name"
                value={form.name}
                onChange={change}
                placeholder="Product Name"
                className="w-full border rounded-lg p-3"
              />

              <textarea
                rows={4}
                name="description"
                value={form.description}
                onChange={change}
                placeholder="Description"
                className="w-full border rounded-lg p-3 resize-none"
              />

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={change}
                  placeholder="Price"
                  className="border rounded-lg p-3"
                />

                <input
                  type="number"
                  name="old_price"
                  value={form.old_price}
                  onChange={change}
                  placeholder="Old Price"
                  className="border rounded-lg p-3"
                />

              </div>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={change}
                placeholder="Stock"
                className="w-full border rounded-lg p-3"
              />

              <select
                name="category_id"
                value={form.category_id}
                onChange={change}
                className="w-full border rounded-lg p-3"
              >

                <option value="">
                  Select Category
                </option>

                {categories.map((category) => (

                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>

                ))}

              </select>

              <select
                name="subcategory_id"
                value={form.subcategory_id}
                onChange={change}
                className="w-full border rounded-lg p-3"
              >

                <option value="">
                  Select Subcategory
                </option>

                {subcategories.map((sub) => (

                  <option
                    key={sub.id}
                    value={sub.id}
                  >
                    {sub.name}
                  </option>

                ))}

              </select>

              <div>

                <label className="font-semibold block mb-2">
                  Product Images
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setImages(Array.from(e.target.files))
                  }
                />

              </div>

              {images.length > 0 && (

                <div className="grid grid-cols-3 gap-3">

                  {images.map((image, index) => (

                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt="preview"
                      className="h-28 w-full object-cover rounded-lg border"
                    />

                  ))}

                </div>

              )}

              <div className="flex gap-8">

                <label className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={change}
                  />

                  Featured

                </label>

                <label className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    name="new_arrival"
                    checked={form.new_arrival}
                    onChange={change}
                  />

                  New Arrival

                </label>

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
                    ? "Update Product"
                    : "Save Product"}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}
            {/* End Drawer */}

    </div>
  </AdminLayout>
);

}
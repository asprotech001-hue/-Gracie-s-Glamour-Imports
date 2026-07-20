import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../supabase/supabase";
import { getSettings, saveSettings as saveSettingsApi, BUCKETS } from "../../services/api";
import toast from "react-hot-toast";

export default function Settings() {
  const [loading, setLoading] = useState(false);

  const [logoFile, setLogoFile] = useState(null);
  const [heroFile, setHeroFile] = useState(null);

  const [form, setForm] = useState({
    id: null,
    store_name: "",
    phone: "",
    whatsapp: "",
    email: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    address: "",
    logo: "",
    hero_image: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const data = await getSettings();

    if (data) {
      setForm(data);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function uploadImage(file, bucket) {
    if (!file) return null;

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    return supabase.storage
      .from(bucket)
      .getPublicUrl(fileName).data.publicUrl;
  }

  async function saveSettings() {
    try {
      setLoading(true);

      let logo = form.logo;
      let hero = form.hero_image;

      if (logoFile) {
        logo = await uploadImage(logoFile, BUCKETS.LOGOS);
      }

      if (heroFile) {
        hero = await uploadImage(heroFile, BUCKETS.HERO);
      }

      const { id, ...rest } = form;

      const payload = {
        ...rest,
        logo,
        hero_image: hero,
      };

      await saveSettingsApi(payload);

      toast.success("Settings Saved");

      loadSettings();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Store Settings
        </h1>

        <div className="bg-white rounded-xl shadow p-8 space-y-5">

          <input
            name="store_name"
            value={form.store_name}
            onChange={handleChange}
            placeholder="Store Name"
            className="border rounded-lg p-3 w-full"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border rounded-lg p-3 w-full"
          />

          <input
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="WhatsApp"
            className="border rounded-lg p-3 w-full"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded-lg p-3 w-full"
          />

          <input
            name="facebook"
            value={form.facebook}
            onChange={handleChange}
            placeholder="Facebook"
            className="border rounded-lg p-3 w-full"
          />

          <input
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="Instagram"
            className="border rounded-lg p-3 w-full"
          />

          <input
            name="tiktok"
            value={form.tiktok}
            onChange={handleChange}
            placeholder="TikTok"
            className="border rounded-lg p-3 w-full"
          />

          <textarea
            rows="4"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Business Address"
            className="border rounded-lg p-3 w-full"
          />

          <div>

            <label className="font-semibold block mb-2">
              Store Logo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setLogoFile(e.target.files[0])
              }
            />

            {form.logo && (
              <img
                src={form.logo}
                className="w-28 mt-4 rounded-lg"
                alt="Logo"
              />
            )}

          </div>

          <div>

            <label className="font-semibold block mb-2">
              Hero Banner
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setHeroFile(e.target.files[0])
              }
            />

            {form.hero_image && (
              <img
                src={form.hero_image}
                className="rounded-lg mt-4 h-48 w-full object-cover"
                alt="Hero"
              />
            )}

          </div>

          <button
            onClick={saveSettings}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>

        </div>

      </div>

    </AdminLayout>
  );
}

import { supabase } from "../supabase/supabase";

/* ==========================
   TABLES
========================== */

export const TABLES = {
  PRODUCTS: "gg_products",
  PRODUCT_IMAGES: "gg_product_images",
  CATEGORIES: "gg_categories",
  SUBCATEGORIES: "gg_subcategories",
  ORDERS: "gg_orders",
  ORDER_ITEMS: "gg_order_items",
  SETTINGS: "gg_settings",
};

/* ==========================
   STORAGE
========================== */

export const BUCKETS = {
  PRODUCTS: "gg-products",
  CATEGORIES: "gg-categories",
  HERO: "gg-hero",
  LOGOS: "gg-logos",
};

/* ==========================
   AUTH
========================== */

export async function adminLogin(email, password) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) throw error;

  return data;
}

export async function adminLogout() {
  const { error } =
    await supabase.auth.signOut();

  if (error) throw error;
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/* ==========================
   CATEGORIES
========================== */

export async function getCategories() {
  const { data, error } = await supabase
    .from(TABLES.CATEGORIES)
    .select("*")
    .order("name");

  if (error) throw error;

  return data || [];
}

export async function addCategory(category) {
  const { data, error } = await supabase
    .from(TABLES.CATEGORIES)
    .insert(category)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCategory(id, updates) {
  const { error } = await supabase
    .from(TABLES.CATEGORIES)
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteCategory(id) {
  const { error } = await supabase
    .from(TABLES.CATEGORIES)
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/* ==========================
   SUBCATEGORIES
========================== */

export async function getSubcategories(categoryId = null) {
  let query = supabase
    .from(TABLES.SUBCATEGORIES)
    .select("*")
    .order("name");

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}

export async function addSubcategory(data) {
  const { error } = await supabase
    .from(TABLES.SUBCATEGORIES)
    .insert(data);

  if (error) throw error;
}

export async function updateSubcategory(id, updates) {
  const { error } = await supabase
    .from(TABLES.SUBCATEGORIES)
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteSubcategory(id) {
  const { error } = await supabase
    .from(TABLES.SUBCATEGORIES)
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/* ==========================
   PRODUCTS
========================== */

export async function getProducts() {
  const { data, error } = await supabase
    .from(TABLES.PRODUCTS)
    .select(`
      *,
      categories:gg_categories(name),
      subcategories:gg_subcategories(name),
      product_images:gg_product_images(image_url)
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
}

export async function getProduct(id) {
  const { data, error } = await supabase
    .from(TABLES.PRODUCTS)
    .select(`
      *,
      categories:gg_categories(name),
      subcategories:gg_subcategories(name),
      product_images:gg_product_images(image_url)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function addProduct(product) {
  const payload = {
    ...product,
    category_id:
      product.category_id || null,

    subcategory_id:
      product.subcategory_id || null,

    old_price:
      product.old_price || null,

    stock:
      Number(product.stock) || 0,

    price:
      Number(product.price),

    featured:
      !!product.featured,

    new_arrival:
      !!product.new_arrival,
  };

  console.log("Saving Product", payload);

  const { data, error } = await supabase
    .from(TABLES.PRODUCTS)
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function updateProduct(id, updates) {
  const { error } = await supabase
    .from(TABLES.PRODUCTS)
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteProduct(id) {
  await supabase
    .from(TABLES.PRODUCT_IMAGES)
    .delete()
    .eq("product_id", id);

  const { error } = await supabase
    .from(TABLES.PRODUCTS)
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/* ==========================
   IMAGE UPLOAD
========================== */

export async function uploadImages(files) {
  const urls = [];

  for (const file of files) {
    const filename =
      `${Date.now()}-${file.name}`;

    const { error } =
      await supabase.storage
        .from(BUCKETS.PRODUCTS)
        .upload(filename, file);

    if (error) throw error;

    const { data } =
      supabase.storage
        .from(BUCKETS.PRODUCTS)
        .getPublicUrl(filename);

    urls.push(data.publicUrl);
  }

  return urls;
}

export async function saveImages(productId, urls) {
  if (!urls.length) return;

  const rows = urls.map((url) => ({
    product_id: productId,
    image_url: url,
  }));

  const { error } = await supabase
    .from(TABLES.PRODUCT_IMAGES)
    .insert(rows);

  if (error) throw error;
}

/* ==========================
   SETTINGS
========================== */

export async function getSettings() {
  const { data, error } = await supabase
    .from(TABLES.SETTINGS)
    .select("*")
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function saveSettings(settings) {
  const existing =
    await getSettings();

  if (existing) {
    const { error } = await supabase
      .from(TABLES.SETTINGS)
      .update(settings)
      .eq("id", existing.id);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from(TABLES.SETTINGS)
      .insert(settings);

    if (error) throw error;
  }
}

/* ==========================
   DASHBOARD
========================== */

export async function dashboardStats() {
  const [
    { count: products },
    { count: categories },
    { count: orders },
  ] = await Promise.all([
    supabase
      .from(TABLES.PRODUCTS)
      .select("*", {
        head: true,
        count: "exact",
      }),

    supabase
      .from(TABLES.CATEGORIES)
      .select("*", {
        head: true,
        count: "exact",
      }),

    supabase
      .from(TABLES.ORDERS)
      .select("*", {
        head: true,
        count: "exact",
      }),
  ]);

  return {
    products: products || 0,
    categories: categories || 0,
    orders: orders || 0,
  };
}

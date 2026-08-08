import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import StrandDivider from "../components/StrandDivider";
import AdminProductForm from "../components/AdminProductForm";
import * as productService from "../services/productService";
import * as userService from "../services/userService";

const AdminDashboard = () => {
  const { t, language } = useLanguage();

  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    const data = await productService.getProducts({
      keyword: search,
      category: categoryFilter,
      limit: 100,
    });
    setProducts(data.products);
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [cats, usersData] = await Promise.all([
          productService.getCategories(),
          userService.getUsers(),
        ]);
        setCategories(cats);
        setUsers(usersData);
        await loadProducts();
      } catch (err) {
        setError(t("common.error"));
      } finally {
        setLoading(false);
      }
    };
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter]);

  const openAddForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSaveProduct = async (data) => {
    setSaving(true);
    setError("");
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, data);
      } else {
        await productService.createProduct(data);
      }
      setMessage(t("admin.productSaved"));
      setShowForm(false);
      await loadProducts();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || t("common.error"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("admin.confirmDelete"))) return;
    try {
      await productService.deleteProduct(id);
      setMessage(t("admin.productDeleted"));
      await loadProducts();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || t("common.error"));
    }
  };

  return (
    <div className="container-v section-v">
      <div className="mb-4">
        <span className="eyebrow-v">Veloura</span>
        <h1 className="section-title-v">{t("admin.dashboard")}</h1>
        <StrandDivider />
      </div>

      <div className="row g-3 mb-5">
        <div className="col-6 col-md-3">
          <div className="admin-stat-card">
            <div className="num">{products.length}</div>
            <div className="text-muted-v" style={{ fontSize: "0.85rem" }}>
              {t("admin.totalProducts")}
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="admin-stat-card">
            <div className="num">{users.length}</div>
            <div className="text-muted-v" style={{ fontSize: "0.85rem" }}>
              {t("admin.totalUsers")}
            </div>
          </div>
        </div>
      </div>

      {message && <div className="alert-v alert-v-success">{message}</div>}
      {error && <div className="alert-v alert-v-error">{error}</div>}

      <div className="d-flex gap-2 mb-4">
        <button
          className={`btn-v btn-v-sm ${tab === "products" ? "btn-v-primary" : "btn-v-outline"}`}
          onClick={() => setTab("products")}
        >
          {t("admin.products")}
        </button>
        <button
          className={`btn-v btn-v-sm ${tab === "users" ? "btn-v-primary" : "btn-v-outline"}`}
          onClick={() => setTab("users")}
        >
          {t("admin.users")}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted-v">{t("common.loading")}</div>
      ) : tab === "products" ? (
        <>
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <input
                className="form-control"
                placeholder={t("admin.searchProducts")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-8 col-md-4">
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">{t("shop.allCategories")}</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {t(`categories.${c}`)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-4 col-md-2">
              <button className="btn-v btn-v-primary w-100" onClick={openAddForm}>
                + {t("admin.addProduct")}
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th></th>
                  <th>{t("admin.nameEn")}</th>
                  <th>{t("admin.category")}</th>
                  <th>{t("admin.price")}</th>
                  <th>{t("admin.stock")}</th>
                  <th>{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8 }}
                      />
                    </td>
                    <td>{language === "ar" ? p.nameAr : p.name}</td>
                    <td>{t(`categories.${p.category}`)}</td>
                    <td>${p.price.toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn-v btn-v-outline btn-v-sm" onClick={() => openEditForm(p)}>
                          {t("admin.editProduct")}
                        </button>
                        <button
                          className="btn-v btn-v-sm"
                          style={{ background: "var(--v-danger)", color: "#fff" }}
                          onClick={() => handleDelete(p._id)}
                        >
                          {t("admin.deleteProduct")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t("admin.userName")}</th>
                <th>{t("admin.userEmail")}</th>
                <th>{t("admin.userRole")}</th>
                <th>{t("admin.joined")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <AdminProductForm
          product={editingProduct}
          onCancel={() => setShowForm(false)}
          onSubmit={handleSaveProduct}
          saving={saving}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

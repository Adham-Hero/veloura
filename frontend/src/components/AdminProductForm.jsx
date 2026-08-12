import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const emptyForm = {
  name: "",
  nameAr: "",
  description: "",
  descriptionAr: "",
  price: "",
  oldPrice: "",
  category: "Shampoo",
  image: "",
  stock: "",
  rating: "",
};

const CATEGORIES = [
  "Shampoo",
  "Conditioner",
  "Hair Oils",
  "Hair Creams",
  "Hair Styling Tools",
  "Hair Care Set",
  "Protein Treatment",
  "Latest Offers",
  "Handmade Bags",
];

const AdminProductForm = ({ product, onCancel, onSubmit, saving }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        nameAr: product.nameAr || "",
        description: product.description || "",
        descriptionAr: product.descriptionAr || "",
        price: product.price ?? "",
        oldPrice: product.oldPrice ?? "",
        category: product.category || "Shampoo",
        image: product.image || "",
        stock: product.stock ?? "",
        rating: product.rating ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      price: parseFloat(form.price),
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
      stock: parseInt(form.stock, 10) || 0,
      rating: form.rating ? parseFloat(form.rating) : 0,
    });
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{
        background: "rgba(0,0,0,0.5)",
        zIndex: 2000,
      }}
    >
      <div
        className="card-v p-4 p-md-5"
        style={{
          maxWidth: 640,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3 style={{ fontFamily: "var(--v-font-display)" }}>
          {product
            ? t("admin.editProduct")
            : t("admin.addProduct")}
        </h3>

        <form
          className="form-v mt-3"
          onSubmit={handleSubmit}
        >
          <div className="row">
            <div className="col-6">
              <label>{t("admin.nameEn")}</label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="col-6">
              <label>{t("admin.nameAr")}</label>
              <input
                name="nameAr"
                required
                dir="rtl"
                value={form.nameAr}
                onChange={handleChange}
              />
            </div>
          </div>

          <label>{t("admin.descriptionEn")}</label>
          <textarea
            name="description"
            rows="3"
            required
            value={form.description}
            onChange={handleChange}
          />

          <label>{t("admin.descriptionAr")}</label>
          <textarea
            name="descriptionAr"
            rows="3"
            dir="rtl"
            required
            value={form.descriptionAr}
            onChange={handleChange}
          />

          <div className="row">
            <div className="col-6">
              <label>{t("admin.price")}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                required
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div className="col-6">
              <label>{t("admin.oldPrice")}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="oldPrice"
                value={form.oldPrice}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <label>{t("admin.category")}</label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t(`categories.${c}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6">
              <label>{t("admin.stock")}</label>
              <input
                type="number"
                min="0"
                name="stock"
                required
                value={form.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <label>{t("admin.image")}</label>
          <input
            name="image"
            required
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
          />

          <label>{t("admin.rating")}</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            name="rating"
            value={form.rating}
            onChange={handleChange}
          />

          <div className="d-flex gap-2 mt-2">
            <button
              type="submit"
              className="btn-v btn-v-primary flex-grow-1"
              disabled={saving}
            >
              {t("admin.save")}
            </button>

            <button
              type="button"
              className="btn-v btn-v-outline flex-grow-1"
              onClick={onCancel}
            >
              {t("admin.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
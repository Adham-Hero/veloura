import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { uploadImage } from "../services/uploadService";

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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

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

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);
    setUploadProgress(0);

    try {
      const url = await uploadImage(file, setUploadProgress);
      setForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      setUploadError(
        err.response?.data?.message || err.friendlyMessage || "Image upload failed. You can paste a URL instead."
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.image) {
      setUploadError(t("admin.imageRequired"));
      return;
    }

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
          <div className="admin-image-upload">
            {form.image && (
              <div className="admin-image-upload__preview">
                <img src={form.image} alt="Product preview" />
              </div>
            )}

            <div className="admin-image-upload__controls">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                disabled={uploading}
                id="product-image-file"
                className="admin-image-upload__file-input"
              />
              <label htmlFor="product-image-file" className="btn-v btn-v-outline btn-v-sm">
                {uploading ? `${t("admin.uploading")} ${uploadProgress}%` : t("admin.uploadImage")}
              </label>
            </div>

            {uploadError && <div className="alert-v alert-v-error mt-2 mb-0">{uploadError}</div>}

            <details className="admin-image-upload__manual">
              <summary>{t("admin.pasteUrlInstead")}</summary>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
                className="mt-2"
              />
            </details>
          </div>

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
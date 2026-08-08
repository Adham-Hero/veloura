import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import StrandDivider from "../components/StrandDivider";
import * as orderService from "../services/orderService";

const Checkout = () => {
  const { t, language } = useLanguage();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "", city: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderResult, setOrderResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        products: items.map((i) => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: form,
      };
      const order = await orderService.createOrder(payload);
      setOrderResult(order);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  if (orderResult) {
    return (
      <div className="container-v section-v text-center">
        <StrandDivider center />
        <h1 className="section-title-v mt-3">{t("checkout.orderSuccess")}</h1>
        <p className="text-muted-v mt-2">
          {t("checkout.orderNumber")}: <strong>{orderResult._id}</strong>
        </p>
        <Link to="/" className="btn-v btn-v-primary mt-4">
          {t("checkout.backToHome")}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-v section-v text-center">
        <p className="text-muted-v">{t("cart.empty")}</p>
        <Link to="/shop" className="btn-v btn-v-primary mt-3">
          {t("cart.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-v section-v">
      <div className="mb-5">
        <span className="eyebrow-v">Veloura</span>
        <h1 className="section-title-v">{t("checkout.title")}</h1>
        <StrandDivider />
      </div>

      <div className="row g-5">
        <div className="col-12 col-lg-7">
          <form className="form-v" onSubmit={handleSubmit}>
            {error && <div className="alert-v alert-v-error">{error}</div>}
            <label>{t("checkout.fullName")}</label>
            <input name="fullName" required value={form.fullName} onChange={handleChange} />
            <label>{t("checkout.email")}</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange} />
            <label>{t("checkout.phone")}</label>
            <input name="phone" required value={form.phone} onChange={handleChange} />
            <label>{t("checkout.address")}</label>
            <input name="address" required value={form.address} onChange={handleChange} />
            <label>{t("checkout.city")}</label>
            <input name="city" required value={form.city} onChange={handleChange} />
            <button className="btn-v btn-v-primary w-100" disabled={loading}>
              {loading ? t("checkout.placingOrder") : t("checkout.placeOrder")}
            </button>
          </form>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card-v p-4">
            <h3 style={{ fontSize: "1.1rem" }}>{t("checkout.orderSummary")}</h3>
            <StrandDivider />
            <div className="mt-3">
              {items.map((item) => {
                const name = language === "ar" ? item.nameAr : item.name;
                return (
                  <div className="d-flex justify-content-between py-2" key={item._id} style={{ fontSize: "0.9rem" }}>
                    <span className="text-muted-v">
                      {name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="d-flex justify-content-between mt-3 pt-3" style={{ borderTop: "1px solid var(--v-line)", fontSize: "1.2rem" }}>
              <strong>{t("cart.total")}</strong>
              <strong className="text-rose-v">${subtotal.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

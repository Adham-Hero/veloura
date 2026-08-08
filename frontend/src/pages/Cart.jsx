import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import StrandDivider from "../components/StrandDivider";

const Cart = () => {
  const { t, language } = useLanguage();
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-v section-v text-center">
        <span className="eyebrow-v">Veloura</span>
        <h1 className="section-title-v">{t("cart.title")}</h1>
        <StrandDivider center />
        <p className="text-muted-v mt-4">{t("cart.empty")}</p>
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
        <h1 className="section-title-v">{t("cart.title")}</h1>
        <StrandDivider />
      </div>

      <div className="row g-5">
        <div className="col-12 col-lg-8">
          {items.map((item) => {
            const name = language === "ar" ? item.nameAr : item.name;
            return (
              <div className="cart-row" key={item._id}>
                <img src={item.image} alt={name} />
                <div className="flex-grow-1">
                  <h3 style={{ fontSize: "1rem", fontFamily: "var(--v-font-display)" }}>{name}</h3>
                  <span className="text-muted-v">${item.price.toFixed(2)}</span>
                </div>
                <div className="qty-selector">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, Math.min(item.stock, item.quantity + 1))}
                  >
                    +
                  </button>
                </div>
                <span className="fw-medium" style={{ minWidth: 70, textAlign: "end" }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  className="icon-btn-v"
                  onClick={() => removeFromCart(item._id)}
                  aria-label={t("cart.remove")}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <div className="col-12 col-lg-4">
          <div className="card-v p-4">
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted-v">{t("cart.subtotal")}</span>
              <span className="fw-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-4" style={{ fontSize: "1.2rem" }}>
              <strong>{t("cart.total")}</strong>
              <strong className="text-rose-v">${subtotal.toFixed(2)}</strong>
            </div>
            <Link to="/checkout" className="btn-v btn-v-primary w-100">
              {t("cart.checkout")}
            </Link>
            <Link to="/shop" className="btn-v btn-v-outline w-100 mt-2">
              {t("cart.continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

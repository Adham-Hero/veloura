import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();

  const displayName = language === "ar" ? product.nameAr : product.name;
  const displayCategory = t(`categories.${product.category}`);
  const inStock = product.stock > 0;

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        {product.oldPrice && <span className="product-card__badge">Sale</span>}
        <Link to={`/product/${product._id}`}>
          <img src={product.image} alt={displayName} loading="lazy" />
        </Link>
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{displayCategory}</span>
        <h3 className="product-card__name">
          <Link to={`/product/${product._id}`}>{displayName}</Link>
        </h3>
        <div className="product-card__rating">
          {"★".repeat(Math.round(product.rating || 0))}
          {"☆".repeat(5 - Math.round(product.rating || 0))}
        </div>
        <div className="product-card__price">
          {product.oldPrice && <span className="old">${product.oldPrice.toFixed(2)}</span>}
          <span className="current">${product.price.toFixed(2)}</span>
        </div>
        <span className={inStock ? "text-muted-v" : "text-rose-v"} style={{ fontSize: "0.8rem" }}>
          {inStock ? t("shop.inStock") : t("shop.outOfStock")}
        </span>
        <div className="product-card__actions">
          <button
            className="btn-v btn-v-primary btn-v-sm flex-grow-1"
            disabled={!inStock}
            onClick={() => addToCart(product, 1)}
          >
            {t("shop.addToCart")}
          </button>
          <Link to={`/product/${product._id}`} className="btn-v btn-v-outline btn-v-sm">
            {t("shop.viewDetails")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

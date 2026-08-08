import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import StrandDivider from "../components/StrandDivider";
import ProductCard from "../components/ProductCard";
import * as productService from "../services/productService";

const ProductDetails = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setAdded(false);
    setQuantity(1);

    productService
      .getProductById(id)
      .then((data) => {
        setProduct(data);
        return productService.getRelatedProducts(id);
      })
      .then(setRelated)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="container-v section-v text-center text-muted-v">{t("common.loading")}</div>;
  }

  if (notFound || !product) {
    return (
      <div className="container-v section-v text-center">
        <p className="text-muted-v">{t("product.notFound")}</p>
        <Link to="/shop" className="btn-v btn-v-primary mt-3">
          {t("shop.title")}
        </Link>
      </div>
    );
  }

  const displayName = language === "ar" ? product.nameAr : product.name;
  const displayDescription = language === "ar" ? product.descriptionAr : product.description;
  const inStock = product.stock > 0;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
  };

  return (
    <div className="container-v section-v">
      <div className="row g-5 align-items-start">
        <div className="col-12 col-lg-6">
          <div className="hero-v__art" style={{ aspectRatio: "1/1" }}>
            <img src={product.image} alt={displayName} />
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <span className="eyebrow-v">{t(`categories.${product.category}`)}</span>
          <h1 className="section-title-v">{displayName}</h1>
          <StrandDivider />
          <div className="product-card__rating mt-3" style={{ fontSize: "1.1rem" }}>
            {"★".repeat(Math.round(product.rating || 0))}
            {"☆".repeat(5 - Math.round(product.rating || 0))}
          </div>

          <div className="d-flex align-items-center gap-3 my-4">
            {product.oldPrice && (
              <span className="old" style={{ fontSize: "1.2rem", textDecoration: "line-through", color: "var(--v-text-muted)" }}>
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
            <span className="current" style={{ fontSize: "2rem", fontWeight: 600, color: "var(--v-rose)" }}>
              ${product.price.toFixed(2)}
            </span>
          </div>

          <h3 style={{ fontSize: "1rem" }}>{t("product.description")}</h3>
          <p className="text-muted-v" style={{ lineHeight: 1.8 }}>
            {displayDescription}
          </p>

          <p className="mb-4">
            <strong>{t("product.stockStatus")}: </strong>
            <span className={inStock ? "text-muted-v" : "text-rose-v"}>
              {inStock ? `${t("shop.inStock")} (${product.stock})` : t("shop.outOfStock")}
            </span>
          </p>

          {inStock && (
            <div className="d-flex align-items-center gap-4 mb-4">
              <span className="fw-medium">{t("product.quantity")}</span>
              <div className="qty-selector">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>
          )}

          <button className="btn-v btn-v-primary" disabled={!inStock} onClick={handleAdd}>
            {t("shop.addToCart")}
          </button>
          {added && <p className="text-rose-v mt-3">{t("product.addedToCart")}</p>}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-5 pt-5">
          <div className="text-center mb-5">
            <h2 className="section-title-v">{t("product.relatedProducts")}</h2>
            <StrandDivider center />
          </div>
          <div className="row g-4">
            {related.map((p) => (
              <div className="col-6 col-md-3" key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

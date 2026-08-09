import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import StrandDivider from "../components/StrandDivider";
import HeroArt3D from "../components/HeroArt3D";
import ProductCard from "../components/ProductCard";
import * as productService from "../services/productService";

const CATEGORY_IMAGES = {
  Shampoo: "https://images.unsplash.com/photo-1585232004423-3e14f4306e0f?w=500",
  Conditioner: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500",
  "Hair Oils": "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500",
  "Hair Masks": "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500",
  "Hair Creams": "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=500",
  "Hair Serums": "https://images.unsplash.com/photo-1610113025603-92e0af88a55c?w=500",
  "Hair Styling": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500",
  "Hair Accessories": "https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=500",
  "Hair Styling Tools": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500",
  "Hair Care Set": "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500",
  "Protein Treatment": "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=500",
};

const Home = () => {
  const { t } = useLanguage();
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [all, cats] = await Promise.all([
          productService.getProducts({ limit: 50 }),
          productService.getCategories(),
        ]);
        setFeatured(all.products.filter((p) => p.isFeatured).slice(0, 4));
        setBestSellers(all.products.filter((p) => p.isBestSeller).slice(0, 4));
        setCategories(cats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div>
      {/* HERO */}
      <section className="hero-v">
        <div className="hero-v__blob" style={{ width: 400, height: 400, background: "var(--v-gold)", top: -100, insetInlineEnd: -100 }} />
        <div className="container-v">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6 hero-v__content">
              <span className="eyebrow-v">Veloura</span>
              <h1 className="hero-v__title">{t("home.heroTitle")}</h1>
              <StrandDivider />
              <p className="hero-v__subtitle mt-4">{t("home.heroSubtitle")}</p>
              <div className="hero-v__actions">
                <Link to="/shop" className="btn-v btn-v-primary">
                  {t("home.shopNow")}
                </Link>
                <Link to="/categories" className="btn-v btn-v-outline">
                  {t("home.exploreCategories")}
                </Link>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="hero-v__art">
                <HeroArt3D />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section-v">
        <div className="container-v">
          <div className="text-center mb-5">
            <span className="eyebrow-v">{t("nav.categories")}</span>
            <h2 className="section-title-v">{t("home.categoriesTitle")}</h2>
            <StrandDivider center />
          </div>
          <div className="row g-3">
            {(categories.length ? categories : Object.keys(CATEGORY_IMAGES)).map((cat) => (
              <div className="col-6 col-md-3" key={cat}>
                <Link to={`/shop?category=${encodeURIComponent(cat)}`} className="category-tile">
                  <img src={CATEGORY_IMAGES[cat]} alt={cat} />
                  <span className="category-tile__label">{t(`categories.${cat}`)}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {!loading && featured.length > 0 && (
        <section className="section-v alt">
          <div className="container-v">
            <div className="text-center mb-5">
              <span className="eyebrow-v">Selection</span>
              <h2 className="section-title-v">{t("home.featuredTitle")}</h2>
              <StrandDivider center />
            </div>
            <div className="row g-4">
              {featured.map((p) => (
                <div className="col-6 col-md-3" key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BEST SELLERS */}
      {!loading && bestSellers.length > 0 && (
        <section className="section-v">
          <div className="container-v">
            <div className="text-center mb-5">
              <span className="eyebrow-v">Loved by many</span>
              <h2 className="section-title-v">{t("home.bestSellersTitle")}</h2>
              <StrandDivider center />
            </div>
            <div className="row g-4">
              {bestSellers.map((p) => (
                <div className="col-6 col-md-3" key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROMO */}
      <section className="section-v alt">
        <div className="container-v">
          <div className="promo-v">
            <span className="eyebrow-v" style={{ color: "var(--v-gold)" }}>
              Veloura Signature
            </span>
            <h2>{t("home.promoTitle")}</h2>
            <p className="mb-4">{t("home.promoSubtitle")}</p>
            <Link to="/shop" className="btn-v btn-v-gold">
              {t("home.promoCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section-v newsletter-v">
        <div className="container-v">
          <span className="eyebrow-v">Stay Connected</span>
          <h2 className="section-title-v">{t("home.newsletterTitle")}</h2>
          <p className="text-muted-v mt-2">{t("home.newsletterSubtitle")}</p>
          {subscribed ? (
            <p className="text-rose-v mt-4 fw-medium">{t("home.newsletterSuccess")}</p>
          ) : (
            <form className="newsletter-v__form" onSubmit={handleSubscribe}>
              <input
                type="email"
                required
                placeholder={t("home.newsletterPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn-v btn-v-primary">
                {t("home.newsletterButton")}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import StrandDivider from "../components/StrandDivider";
import ProductCard from "../components/ProductCard";
import * as productService from "../services/productService";

const CATEGORY_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f3e9e4'/%3E%3Ctext x='200' y='250' font-family='sans-serif' font-size='18' fill='%23a08c8f' text-anchor='middle'%3EImage coming soon%3C/text%3E%3C/svg%3E";

const CATEGORY_IMAGES = {
  Shampoo: "/images/categories/shampoo.jpg",
  Conditioner: "/images/categories/conditioner.jpg",
  "Hair Oils": "/images/categories/hair-oils.jpg",
  "Hair Creams": "/images/categories/hair-creams.jpg",
  "Hair Styling Tools": "/images/categories/hair-styling-tools.jpg",
  "Hair Care Set": "/images/categories/hair-care-set.jpg",
  "Protein Treatment": "/images/categories/protein-treatment.jpg",
  "Latest Offers": "/images/categories/latest-offers.jpg",
  "Handmade Bags": "/images/categories/handmade-bags.jpg",
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

        setFeatured(
          all.products
            .filter((p) => p.isFeatured)
            .slice(0, 4)
        );

        setBestSellers(
          all.products
            .filter((p) => p.isBestSeller)
            .slice(0, 4)
        );

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

    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <div>
      {/* HERO */}
      <section className="hero-v">
        <div
          className="hero-v__blob"
          style={{
            width: 400,
            height: 400,
            background: "var(--v-gold)",
            top: -100,
            insetInlineEnd: -100,
          }}
        />

        <div className="container-v">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6 hero-v__content">
              <span className="eyebrow-v">Veloura</span>

              <h1 className="hero-v__title">
                {t("home.heroTitle")}
              </h1>

              <StrandDivider />

              <p className="hero-v__subtitle mt-4">
                {t("home.heroSubtitle")}
              </p>

              <div className="hero-v__actions">
                <Link to="/shop" className="btn-v btn-v-primary">
                  {t("home.shopNow")}
                </Link>

                <Link
                  to="/categories"
                  className="btn-v btn-v-outline"
                >
                  {t("home.exploreCategories")}
                </Link>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="hero-v__logo-wrap">
                <div className="hero-v__logo-glow" />

                <img
                  src="/images/brand/veloura-logo.jpg"
                  alt="Veloura"
                  className="hero-v__logo"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section-v">
        <div className="container-v">
          <div className="text-center mb-5">
            <span className="eyebrow-v">
              {t("nav.categories")}
            </span>

            <h2 className="section-title-v">
              {t("home.categoriesTitle")}
            </h2>

            <StrandDivider center />
          </div>

          <div className="row g-3">
            {(categories.length
              ? categories
              : Object.keys(CATEGORY_IMAGES)
            ).map((cat) => (
              <div
                className="col-6 col-md-3"
                key={cat}
              >
                <Link
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  className="category-tile"
                >
                  <img
                    src={
                      CATEGORY_IMAGES[cat] ||
                      CATEGORY_IMAGES.Shampoo
                    }
                    alt={cat}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        CATEGORY_PLACEHOLDER;
                    }}
                  />

                  <span className="category-tile__label">
                    {t(`categories.${cat}`)}
                  </span>
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
              <span className="eyebrow-v">
                Selection
              </span>

              <h2 className="section-title-v">
                {t("home.featuredTitle")}
              </h2>

              <StrandDivider center />
            </div>

            <div className="row g-4">
              {featured.map((p) => (
                <div
                  className="col-6 col-md-3"
                  key={p._id}
                >
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
              <span className="eyebrow-v">
                Loved by many
              </span>

              <h2 className="section-title-v">
                {t("home.bestSellersTitle")}
              </h2>

              <StrandDivider center />
            </div>

            <div className="row g-4">
              {bestSellers.map((p) => (
                <div
                  className="col-6 col-md-3"
                  key={p._id}
                >
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
            <span
              className="eyebrow-v"
              style={{ color: "var(--v-gold)" }}
            >
              Veloura Signature
            </span>

            <h2>{t("home.promoTitle")}</h2>

            <p className="mb-4">
              {t("home.promoSubtitle")}
            </p>

            <Link
              to="/shop"
              className="btn-v btn-v-gold"
            >
              {t("home.promoCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section-v newsletter-v">
        <div className="container-v">
          <span className="eyebrow-v">
            Stay Connected
          </span>

          <h2 className="section-title-v">
            {t("home.newsletterTitle")}
          </h2>

          <p className="text-muted-v mt-2">
            {t("home.newsletterSubtitle")}
          </p>

          {subscribed ? (
            <p className="text-rose-v mt-4 fw-medium">
              {t("home.newsletterSuccess")}
            </p>
          ) : (
            <form
              className="newsletter-v__form"
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                required
                placeholder={t(
                  "home.newsletterPlaceholder"
                )}
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <button
                type="submit"
                className="btn-v btn-v-primary"
              >
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

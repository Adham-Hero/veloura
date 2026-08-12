import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import StrandDivider from "../components/StrandDivider";
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
  "Handmade Bags": "/images/categories/handmade-bags.jp",
};

const Categories = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState(Object.keys(CATEGORY_IMAGES));

  useEffect(() => {
    productService
      .getCategories()
      .then((cats) => {
        if (cats.length) {
          setCategories(cats);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="container-v section-v">
      <div className="text-center mb-5">
        <span className="eyebrow-v">Veloura</span>
        <h1 className="section-title-v">
          {t("home.categoriesTitle")}
        </h1>
        <StrandDivider center />
      </div>

      <div className="row g-4">
        {categories.map((cat) => (
          <div className="col-6 col-md-4 col-lg-3" key={cat}>
            <Link
              to={`/shop?category=${encodeURIComponent(cat)}`}
              className="category-tile"
            >
              <img
                src={CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.Shampoo}
                alt={cat}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = CATEGORY_PLACEHOLDER;
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
  );
};

export default Categories;

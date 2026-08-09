import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import StrandDivider from "../components/StrandDivider";
import * as productService from "../services/productService";

const CATEGORY_IMAGES = {
  Shampoo: "/Img/Shampo.jpg",
  Conditioner: "/Img/Blsm.jpg",
  "Hair Oils": "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600",
  "Hair Masks": "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600",
  "Hair Creams": "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=600",
  "Hair Serums": "https://images.unsplash.com/photo-1610113025603-92e0af88a55c?w=600",
  "Hair Styling": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600",
  "Hair Accessories": "https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=600",
  "Hair Styling Tools": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600",
  "Hair Care Set": "/Img/full care.jpg",
  "Protein Treatment": "/Img/Proten.jpg",
};

const Categories = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState(Object.keys(CATEGORY_IMAGES));

  useEffect(() => {
    productService.getCategories().then((cats) => cats.length && setCategories(cats)).catch(() => {});
  }, []);

  return (
    <div className="container-v section-v">
      <div className="text-center mb-5">
        <span className="eyebrow-v">Veloura</span>
        <h1 className="section-title-v">{t("home.categoriesTitle")}</h1>
        <StrandDivider center />
      </div>
      <div className="row g-4">
        {categories.map((cat) => (
          <div className="col-6 col-md-4 col-lg-3" key={cat}>
            <Link to={`/shop?category=${encodeURIComponent(cat)}`} className="category-tile">
              <img src={CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.Shampoo} alt={cat} />
              <span className="category-tile__label">{t(`categories.${cat}`)}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;

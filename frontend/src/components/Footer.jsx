import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="footer-v">
      <div className="container-v">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="logo mb-2">Veloura</div>
            <p className="text-muted-v" style={{ maxWidth: 280 }}>
              {t("footer.tagline")}
            </p>
          </div>
          <div className="col-6 col-md-4">
            <h6>{t("footer.quickLinks")}</h6>
            <Link to="/shop">{t("nav.shop")}</Link>
            <Link to="/categories">{t("nav.categories")}</Link>
            <Link to="/about">{t("nav.about")}</Link>
            <Link to="/contact">{t("nav.contact")}</Link>
          </div>
          <div className="col-6 col-md-4">
            <h6>{t("footer.contactUs")}</h6>
            <a href="mailto:hello@veloura.com">hello@veloura.com</a>
            <a href="tel:+10000000000">+1 (000) 000-0000</a>
          </div>
        </div>
        <div className="footer-v__bottom">
          © {year} Veloura. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

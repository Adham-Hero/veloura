import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    url: "https://facebook.com/veloura",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://instagram.com/veloura",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.65a6.19 6.19 0 1 0 0 12.38 6.19 6.19 0 0 0 0-12.38Zm0 10.2a4.02 4.02 0 1 1 0-8.03 4.02 4.02 0 0 1 0 8.03Zm6.44-10.44a1.44 1.44 0 1 1-2.89 0 1.44 1.44 0 0 1 2.89 0Z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    url: "https://tiktok.com/@veloura",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M16.5 3h-3.02v12.4a2.59 2.59 0 1 1-1.83-2.47V9.83a5.7 5.7 0 1 0 4.85 5.63V9.9a6.98 6.98 0 0 0 4 1.27V8.14a3.98 3.98 0 0 1-1.87-.48A4.02 4.02 0 0 1 16.5 3.9V3Z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/201554372442",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2.05 22l5.27-1.38a9.87 9.87 0 0 0 4.72 1.2h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.05c-.24.68-1.4 1.33-1.93 1.4-.5.08-1.12.11-1.8-.12a16.6 16.6 0 0 1-1.65-.61c-2.9-1.25-4.8-4.17-4.94-4.36-.15-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.29.58-.36.77-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.59.83 2.02.9 2.17.07.15.11.32.02.51-.09.19-.14.31-.27.48-.14.17-.29.37-.41.5-.14.14-.28.28-.12.56.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.17-.19.71-.83.9-1.12.19-.28.38-.23.63-.14.26.09 1.65.78 1.94.92.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
      </svg>
    ),
  },
];

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
            <div className="footer-v__social">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="footer-v__social-icon"
                >
                  {s.icon}
                </a>
              ))}
            </div>
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
            <a href="mailto:eltonyahmed232@gmail.com">eltonyahmed232@gmail.com</a>
            <a href="https://wa.me/201554372442" target="_blank" rel="noopener noreferrer">
              01554372442
            </a>
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

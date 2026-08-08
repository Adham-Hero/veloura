import { useLanguage } from "../context/LanguageContext";
import StrandDivider from "../components/StrandDivider";

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="container-v section-v">
      <div className="row align-items-center g-5">
        <div className="col-12 col-lg-6">
          <span className="eyebrow-v">Veloura</span>
          <h1 className="section-title-v">{t("about.title")}</h1>
          <StrandDivider />
          <p className="text-muted-v mt-4" style={{ lineHeight: 1.9 }}>
            {t("about.body1")}
          </p>
          <p className="text-muted-v" style={{ lineHeight: 1.9 }}>
            {t("about.body2")}
          </p>
        </div>
        <div className="col-12 col-lg-6">
          <div className="hero-v__art">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900"
              alt="Veloura studio"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

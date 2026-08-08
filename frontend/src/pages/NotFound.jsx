import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import StrandDivider from "../components/StrandDivider";

const NotFound = () => {
  const { t } = useLanguage();
  return (
    <div className="container-v section-v text-center">
      <span className="eyebrow-v">404</span>
      <h1 className="section-title-v">Page Not Found</h1>
      <StrandDivider center />
      <Link to="/" className="btn-v btn-v-primary mt-4">
        {t("checkout.backToHome")}
      </Link>
    </div>
  );
};

export default NotFound;

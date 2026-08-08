import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import StrandDivider from "../components/StrandDivider";

const Register = () => {
  const { t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || t("auth.emailExists"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-v">
      <div className="card-v auth-card">
        <div className="text-center mb-4">
          <span className="eyebrow-v">Veloura</span>
          <h1 className="section-title-v" style={{ fontSize: "1.8rem" }}>
            {t("auth.registerTitle")}
          </h1>
          <StrandDivider center />
        </div>
        <form className="form-v" onSubmit={handleSubmit}>
          {error && <div className="alert-v alert-v-error">{error}</div>}
          <label>{t("auth.name")}</label>
          <input name="name" required value={form.name} onChange={handleChange} />
          <label>{t("auth.email")}</label>
          <input type="email" name="email" required value={form.email} onChange={handleChange} />
          <label>{t("auth.password")}</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
          />
          <button className="btn-v btn-v-primary w-100" disabled={loading}>
            {t("auth.registerButton")}
          </button>
        </form>
        <p className="text-center text-muted-v mt-4">
          {t("auth.haveAccount")}{" "}
          <Link to="/login" className="text-rose-v fw-medium">
            {t("auth.signInHere")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

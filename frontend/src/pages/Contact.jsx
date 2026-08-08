import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import StrandDivider from "../components/StrandDivider";

const Contact = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="container-v section-v">
      <div className="text-center mb-5">
        <span className="eyebrow-v">Veloura</span>
        <h1 className="section-title-v">{t("contact.title")}</h1>
        <StrandDivider center />
        <p className="text-muted-v mt-3" style={{ maxWidth: 480, margin: "0 auto" }}>
          {t("contact.subtitle")}
        </p>
      </div>

      <div className="card-v p-4 p-md-5" style={{ maxWidth: 560, margin: "0 auto" }}>
        {sent ? (
          <div className="alert-v alert-v-success text-center">{t("contact.sent")}</div>
        ) : (
          <form className="form-v" onSubmit={handleSubmit}>
            <label>{t("contact.name")}</label>
            <input name="name" required value={form.name} onChange={handleChange} />
            <label>{t("contact.email")}</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange} />
            <label>{t("contact.message")}</label>
            <textarea name="message" rows="5" required value={form.message} onChange={handleChange} />
            <button className="btn-v btn-v-primary w-100">{t("contact.send")}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;

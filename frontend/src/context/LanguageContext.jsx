import { createContext, useContext, useEffect, useState } from "react";
import en from "../i18n/en";
import ar from "../i18n/ar";

const translations = { en, ar };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem("veloura_lang") || "en");

  useEffect(() => {
    localStorage.setItem("veloura_lang", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("font-ar", language === "ar");
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  // Simple key lookup, e.g. t("nav.home")
  const t = (key) => {
    const parts = key.split(".");
    let value = translations[language];
    for (const part of parts) {
      value = value?.[part];
    }
    return value ?? key;
  };

  const isRTL = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

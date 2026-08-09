import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/shop", label: t("nav.shop") },
    { to: "/categories", label: t("nav.categories") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar-v py-3">
      <div className="container-v d-flex align-items-center justify-content-between">
        <Link to="/" className="logo navbar-v__brand">
          <img src="/images/brand/veloura-logo-small.jpg" alt="Veloura" className="navbar-v__logo-img" />
          <span>Veloura</span>
        </Link>

        <div className="d-none d-lg-flex align-items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => `nav-link-v ${isActive ? "active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="d-flex align-items-center gap-2">
          <button className="icon-btn-v d-none d-md-inline-flex" onClick={toggleLanguage} title="Language" aria-label="Toggle language">
            {language === "en" ? "AR" : "EN"}
          </button>
          <button className="icon-btn-v" onClick={toggleTheme} title="Theme" aria-label="Toggle theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <Link to="/cart" className="icon-btn-v" aria-label={t("nav.cart")}>
            🛍
            {itemCount > 0 && <span className="cart-badge-v">{itemCount}</span>}
          </Link>

          {user ? (
            <div className="dropdown d-none d-md-block">
              <button
                className="btn-v btn-v-outline btn-v-sm dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.name.split(" ")[0]}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                {isAdmin && (
                  <li>
                    <Link className="dropdown-item" to="/admin">
                      {t("nav.admin")}
                    </Link>
                  </li>
                )}
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    {t("nav.logout")}
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn-v btn-v-primary btn-v-sm d-none d-md-inline-flex">
              {t("nav.login")}
            </Link>
          )}

          <button
            className="icon-btn-v d-lg-none"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="d-lg-none border-top mt-3 pt-3" style={{ borderColor: "var(--v-line)" }}>
          <div className="container-v d-flex flex-column gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className="nav-link-v"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <button className="nav-link-v text-start" onClick={toggleLanguage}>
              {language === "en" ? "العربية" : "English"}
            </button>
            {user ? (
              <>
                {isAdmin && (
                  <Link className="nav-link-v" to="/admin" onClick={() => setOpen(false)}>
                    {t("nav.admin")}
                  </Link>
                )}
                <button className="nav-link-v text-start" onClick={handleLogout}>
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <Link className="nav-link-v" to="/login" onClick={() => setOpen(false)}>
                {t("nav.login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

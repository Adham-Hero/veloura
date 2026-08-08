import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import ProductCard from "../components/ProductCard";
import StrandDivider from "../components/StrandDivider";
import * as productService from "../services/productService";

const Shop = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageInfo, setPageInfo] = useState({ page: 1, pages: 1, total: 0 });

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    productService.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await productService.getProducts({ keyword, category, sort, page, limit: 8 });
        setProducts(data.products);
        setPageInfo({ page: data.page, pages: data.pages, total: data.total });
      } catch (err) {
        setError(t("common.error"));
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, category, sort, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.set("page", "1");
    setSearchParams(next);
  };

  return (
    <div className="container-v section-v">
      <div className="text-center mb-5">
        <span className="eyebrow-v">Veloura</span>
        <h1 className="section-title-v">{t("shop.title")}</h1>
        <StrandDivider center />
      </div>

      <div className="row g-3 mb-5">
        <div className="col-12 col-md-5">
          <input
            className="form-control"
            style={{ borderRadius: 999, padding: "12px 18px" }}
            placeholder={t("shop.searchPlaceholder")}
            defaultValue={keyword}
            onKeyDown={(e) => e.key === "Enter" && updateParam("keyword", e.target.value)}
            onBlur={(e) => updateParam("keyword", e.target.value)}
          />
        </div>
        <div className="col-6 col-md-4">
          <select
            className="form-select"
            style={{ borderRadius: 999, padding: "12px 18px" }}
            value={category}
            onChange={(e) => updateParam("category", e.target.value === "all" ? "" : e.target.value)}
          >
            <option value="all">{t("shop.allCategories")}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {t(`categories.${c}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-3">
          <select
            className="form-select"
            style={{ borderRadius: 999, padding: "12px 18px" }}
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
          >
            <option value="newest">{t("shop.sortNewest")}</option>
            <option value="price_asc">{t("shop.sortPriceAsc")}</option>
            <option value="price_desc">{t("shop.sortPriceDesc")}</option>
            <option value="rating">{t("shop.sortRating")}</option>
          </select>
        </div>
      </div>

      {error && <div className="alert-v alert-v-error">{error}</div>}

      {loading ? (
        <div className="text-center py-5 text-muted-v">{t("common.loading")}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-5 text-muted-v">{t("shop.noProducts")}</div>
      ) : (
        <>
          <div className="row g-4">
            {products.map((p) => (
              <div className="col-6 col-md-4 col-lg-3" key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {pageInfo.pages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
              <button
                className="btn-v btn-v-outline btn-v-sm"
                disabled={pageInfo.page <= 1}
                onClick={() => updateParam("page", String(pageInfo.page - 1))}
              >
                ‹
              </button>
              <span className="text-muted-v">
                {t("shop.page")} {pageInfo.page} {t("shop.of")} {pageInfo.pages}
              </span>
              <button
                className="btn-v btn-v-outline btn-v-sm"
                disabled={pageInfo.page >= pageInfo.pages}
                onClick={() => updateParam("page", String(pageInfo.page + 1))}
              >
                ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Shop;

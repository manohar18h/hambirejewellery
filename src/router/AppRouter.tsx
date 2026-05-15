import { Routes, Route } from "react-router-dom";
import Header from "../components/header/Header";
import Home from "../pages/Home";
import CategoryPage from "../pages/CategoryPage";
import ProductListingPage from "../pages/ProductListingPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";

const AppRouter = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
        <Route
          path="/category/:categorySlug/:subCategorySlug"
          element={<ProductListingPage />}
        />
        <Route path="/product/:productSlug" element={<ProductDetailsPage />} />
      </Routes>
    </>
  );
};

export default AppRouter;

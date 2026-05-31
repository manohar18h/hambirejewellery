import { Routes, Route } from "react-router-dom";
import Header from "../components/header/Header";
import Home from "../pages/Home";
import CategoryPage from "../pages/CategoryPage";
import ProductListingPage from "../pages/ProductListingPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import Schemes from "../pages/Schemes";
import PreBookingScheme from "../pages/PreBookingScheme";
import Flexi11Scheme from "../pages/Flexi11Scheme";
import QuickBuyScheme from "../pages/QuickBuyScheme";
import SchemeRegister from "../pages/SchemeRegister";


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
        <Route path="/schemes" element={<Schemes />} />
<Route path="/schemes/pre-booking" element={<PreBookingScheme />} />
<Route path="/schemes/flexi-11" element={<Flexi11Scheme />} />
<Route path="/schemes/quick-buy" element={<QuickBuyScheme />} />
<Route path="/schemes/register" element={<SchemeRegister />} />
        <Route path="/product/:productSlug" element={<ProductDetailsPage />} />
      </Routes>
    </>
  );
};

export default AppRouter;

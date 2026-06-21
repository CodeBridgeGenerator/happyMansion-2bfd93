import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';

import SingleProductsPage from "../components/app_components/ProductsPage/SingleProductsPage";
import ProductProjectLayoutPage from "../components/app_components/ProductsPage/ProductProjectLayoutPage";
import SingleBrandPage from "../components/app_components/BrandPage/SingleBrandPage";
import BrandProjectLayoutPage from "../components/app_components/BrandPage/BrandProjectLayoutPage";
import SingleWeightPage from "../components/app_components/WeightPage/SingleWeightPage";
import WeightProjectLayoutPage from "../components/app_components/WeightPage/WeightProjectLayoutPage";
import SinglePackingPage from "../components/app_components/PackingPage/SinglePackingPage";
import PackingProjectLayoutPage from "../components/app_components/PackingPage/PackingProjectLayoutPage";
import SingleCategoryPage from "../components/app_components/CategoryPage/SingleCategoryPage";
import CategoryProjectLayoutPage from "../components/app_components/CategoryPage/CategoryProjectLayoutPage";
//  ~cb-add-import~

const AppRouter = () => {
    return (
        <Routes>
            {/* ~cb-add-unprotected-route~ */}
<Route path="/products/:singleProductsId" exact element={<SingleProductsPage />} />
<Route path="/products" exact element={<ProductProjectLayoutPage />} />
<Route path="/brand/:singleBrandId" exact element={<SingleBrandPage />} />
<Route path="/brand" exact element={<BrandProjectLayoutPage />} />
<Route path="/weight/:singleWeightId" exact element={<SingleWeightPage />} />
<Route path="/weight" exact element={<WeightProjectLayoutPage />} />
<Route path="/packing/:singlePackingId" exact element={<SinglePackingPage />} />
<Route path="/packing" exact element={<PackingProjectLayoutPage />} />
<Route path="/category/:singleCategoryId" exact element={<SingleCategoryPage />} />
<Route path="/category" exact element={<CategoryProjectLayoutPage />} />
            <Route element={<ProtectedRoute redirectPath={'/login'} />}>{/* ~cb-add-protected-route~ */}</Route>
        </Routes>
    );
};

const mapState = (state) => {
    const { isLoggedIn } = state.auth;
    return { isLoggedIn };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data)
});

export default connect(mapState, mapDispatch)(AppRouter);

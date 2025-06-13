import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import routePaths from "./route.paths";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import LoadingFallback from "../components/FallbackLoading";

const Login = lazy(() => import("../pages/auth/Login"));

const Home = lazy(() => import("../pages/Home"));
const ResponseForm = lazy(() => import("../pages/FormResponse"));
const DetailForm = lazy(() => import("../pages/FormDetail"));

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path={routePaths.login} element={<Login />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path={routePaths.home} element={<Home />} />
              <Route path={routePaths.detail} element={<DetailForm />} />
              <Route path={routePaths.response} element={<ResponseForm />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;

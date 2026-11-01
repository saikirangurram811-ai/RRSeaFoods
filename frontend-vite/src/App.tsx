import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout/Layout";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import Product from "./pages/Dashboard/Product";
import MasterPage from "./pages/Dashboard/MasterPage";
import Settings from "./pages/Dashboard/Settings";
import Profile from "./components/Header/Profile";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";
import Stock from "./pages/Dashboard/Stock";

const ALL_ROLES = ["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"];
const ADMIN_ROLES = ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"];

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        containerStyle={{ zIndex: 99999 }}
        toastOptions={{ duration: 3000 }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Shell */}
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={ALL_ROLES}>
                <DashboardHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/product"
            element={
              <ProtectedRoute allowedRoles={ALL_ROLES}>
                <Product />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/stock"
            element={
              <ProtectedRoute allowedRoles={ALL_ROLES}>
                <Stock />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/master/state"
            element={
              <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                <MasterPage type="state" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/master/district"
            element={
              <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                <MasterPage type="district" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/master/department"
            element={
              <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                <MasterPage type="department" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/master/org"
            element={
              <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                <MasterPage type="org" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute allowedRoles={ALL_ROLES}>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute allowedRoles={ALL_ROLES}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard Shell */}
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}>
              <DashboardHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/product"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}>
              <Product />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/master/state"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}>
              <MasterPage type="state" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/master/district"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}>
              <MasterPage type="district" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/master/department"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}>
              <MasterPage type="department" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/master/org"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}>
              <MasterPage type="org" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;

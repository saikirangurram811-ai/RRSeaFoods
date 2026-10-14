import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './components/Layout/Layout'
import DashboardHome from './pages/Dashboard/DashboardHome'
import ProtectedRoute from './components/ProtectedRoutes/ProtectedRoutes'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}>
              <DashboardHome />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
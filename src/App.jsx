// src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import TaskPage from "./pages/TaskPage";
import TeamPage from "./pages/TeamPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // ❌ Hide navbar on login & register pages
  const hideNavbarOnPaths = ["/login", "/register"];
  const shouldShowNavbar = !hideNavbarOnPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        {/* Redirect root (/) to dashboard if logged in, else login */}
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        {/* ✅ Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <TeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 404 fallback */}
        <Route path="*" element={<h1>404 – Page Not Found</h1>} />
      </Routes>

      {/* ✅ Toasts */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;

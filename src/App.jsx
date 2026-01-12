import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ComplaintForm from "./components/ComplaintForm";
import Dashboard from "./components/Dashboard";
import ComplaintFMS from "./components/ComplaintFMS";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoutes";
import ComplaintStatusPage from "./components/ComplaintStatusPage";
import { Toaster } from "react-hot-toast";
import ResetPassword from "./components/ResetPassword";
function App() {
  return (
    <AuthProvider>
      {/* ✅ TOASTER SHOULD BE HERE */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "16px",
            padding: "16px 20px",
            minWidth: "320px",
            borderRadius: "12px",
            fontWeight: "600",
          },
          success: {
            style: {
              background: "#16a34a",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#16a34a",
            },
          },
          error: {
            style: {
              background: "#dc2626",
              color: "#fff",
            },
          },
          loading: {
            style: {
              background: "#1e293b",
              color: "#fff",
            },
          },
        }}
      />

      <BrowserRouter>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Login />} />
          <Route path="/complaint-form" element={<ComplaintForm />} />
          {/* ComplaintFMS is now Public: Accessible without login */}
          <Route path="/complaintFMS" element={<ComplaintFMS />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* --- PROTECTED ROUTES --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/complaint-form"
            element={
              <ProtectedRoute>
                <ComplaintForm />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/complaintFMS"
            element={
              <ProtectedRoute>
                <ComplaintFMS />
              </ProtectedRoute>
            }
          />
          <Route
            path="/status/:id"
            element={
              <ProtectedRoute>
                <ComplaintStatusPage />
              </ProtectedRoute>
            }
          />

          {/* Optional: If you want a specific protected version, 
              you can leave the route above as is. 
              But usually, a public route is visible to everyone anyway. */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login.page/login.form";
import RegisterPage from "./pages/register.page/register.form";
import HomePage from "./pages/home.page/home.page";
import TasksPage from "./pages/tasks.page/tasks.page";
import SendResetCode from "./pages/send-reset-code.page/send-reset-code";
import VerifyResetCode from "./pages/verify_reset_code.page/verify_reset_code";
import { EmailProvider } from "./components/providers/email.provider";
import ResetPassword from "./pages/reset-password.page/reset-password";
import { Navigate } from "react-router-dom";
import Navbar from "./components/nav.component/nav.component";
import ProtectedRoute from "./components/protected.hook/protected.route";

function App() {
  return (
    <EmailProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<ProtectedRoute><HomePage/></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tasks" element={<ProtectedRoute><TasksPage/></ProtectedRoute>} />
          <Route path="/tasks/:id" element={<TasksPage />} />
          <Route path="/send-reset-code" element={<SendResetCode />} />
          <Route path="/verify-reset-code" element={<VerifyResetCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </EmailProvider>
  );
}

export default App;

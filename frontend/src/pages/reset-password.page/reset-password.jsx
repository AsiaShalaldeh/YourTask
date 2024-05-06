import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEmail } from "../../components/providers/email.provider";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { email: email } = useEmail();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const resetPassword = async () => {
    try {
        console.log(password);
        console.log(email);
      const response = await axios.post("http://127.0.0.1:8000/reset-password/", {
        email: email, 
        new_password: password
      });
      navigate("/login", { replace: true });
      setSuccess(response.data.success);
      setError("");
    } catch (error) {
      setError(error.response.data.error);
      setSuccess("");
    }
  };

  return (
    <div>
        <h1>تعيين كلمةالمرور الجديدة</h1>
      <label htmlFor="password">كلمة المرور</label>
      <div style={{ position: "relative" }}>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your new password"
        />
        {showPassword ? (
          <VisibilityOff onClick={togglePasswordVisibility} style={{ position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)" }} />
        ) : (
          <Visibility onClick={togglePasswordVisibility} style={{ position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)" }} />
        )}
      </div>
      <button onClick={resetPassword}>إعادة تعيين كلمة المرور</button>
      {success && <p>{success}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default ResetPassword;

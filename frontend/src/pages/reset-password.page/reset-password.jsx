import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useEmail } from "../../components/providers/email.provider";
import "./reset-password.css";
import { TextField, Button, Typography, IconButton } from "@mui/material";

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
      const response = await axios.post(
        "http://127.0.0.1:8000/reset-password/",
        {
          email: email,
          new_password: password,
        }
      );
      navigate("/login", { replace: true });
      // setSuccess(response.data.success);
      setError("");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error)
        setError(error.response.data.error);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h1>تعيين كلمة المرور الجديدة</h1>
        <label htmlFor="password">كلمة المرور</label>
        <div style={{ position: "relative" }}>
          <TextField
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            placeholder="%$@#"
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
        </div>
        {error && <Typography color="error">{error}</Typography>}
        <div className="instructions">
          <p>يجب أن تتكون كلمة المرور على 8 رموز على الأقل</p>
          <p>يجب أن تحتوي كلمة المرور على رموز و أرقام</p>
        </div>
        <Button
          onClick={resetPassword}
          variant="contained"
          fullWidth
          color="primary"
          className="submit-button"
        >
          إعادة تعيين كلمة المرور
        </Button>
        هل تدكرت كلمة المرور؟ <Link to="/login">تسجيل الدخول</Link>
      </div>
      <div className="image-container">
        <img
          src={process.env.PUBLIC_URL + "images/forget password 3.png"}
          alt="إعادة كلمة المرور"
        />
        <h1>أنت تبلي حسنا</h1>
        <p>
          {" "}
          يمكنك الآن إعادة كلمة المرور وإدخال كلمة مرور جديدة والبدء في إنجاز
          مهماتك...
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;

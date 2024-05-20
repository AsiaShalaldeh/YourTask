import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./login.form.css";

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        email: email,
        password: password,
      });

      const data = response.data;

      const accessToken = data.access_token;
      localStorage.clear();
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", data.refresh_token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      if (data.user_image) {
        localStorage.setItem("user_image", data.user_image);
      }

      // Navigate based on has_task value
      if (data.has_task) {
        navigate("/tasks", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="login-box">
          <div className="login-content">
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              className="title"
            >
              تسجيل الدخول
            </Typography>
            <form onSubmit={handleSubmit}>
              <label>البريد الإلكتروني</label>
              <TextField
                variant="outlined"
                className="input-field"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
              />
              <label> كلمة المرور</label>
              <TextField
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error && (
                <Typography
                  variant="body2"
                  color="error"
                  className="error-message"
                >
                  {error}
                </Typography>
              )}
              <Typography>
                <Link to="/send-reset-code">
                  <span className="forgot-password">نسيت كلمة المرور؟</span>
                </Link>
              </Typography>
              <Button
                className="submit-button"
                type="submit"
                variant="contained"
                fullWidth
              >
                تسجيل الدخول
              </Button>
            </form>
            <Typography align="center" sx={{ marginTop: "20px" }}>
              <span className="no-account">ليس لديك حساب؟</span>
              <Link to="/register" className="no-account">
                &nbsp;<span className="create-account">إنشاء حساب</span>
              </Link>
            </Typography>
          </div>
        </div>
      </div>
      <div className="image-container">
        <img
          src={process.env.PUBLIC_URL + "images/sign_in.png"}
          alt="أهلا بك"
        />
        <h1 className="title inter-custom">مرحبا بك في موقع مهمتك</h1>
        <p className="desc">
          مهمتك هو عبارة عن موقع إلكتروني يساعدك في إنجاز مهامك بسهولة
        </p>
      </div>
    </div>
  );
}

export default LoginForm;

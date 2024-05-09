import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Diversity1Sharp,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
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

    fetch("http://127.0.0.1:8000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid email or password");
        }
        return response.json();
      })
      .then((data) => {
        const accessToken = data.access_token;
        localStorage.clear();
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", data.refresh_token);
        console.log(accessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        // Store the image in local storage
        localStorage.setItem("user_image", data.user_image);

        navigate("/tasks", { replace: true });
      })
      .catch((error) => {
        setError(error.message);
      });
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
              <Typography align="center" sx={{ marginTop: "20px" }}>
                <Link to="/send-reset-code">نسيت كلمة المرور؟</Link>
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
              ليس لديك حساب؟ <Link to="/register">إنشاء حساب</Link>
            </Typography>
          </div>
        </div>
      </div>
      <div className="image-container">
        <img
          src={process.env.PUBLIC_URL + "images/sign in.png"}
          alt="أهلا بك"
        />
        <h1>مرحبا بك في موقع مهمتك</h1>
        <p>مهمتك هو عبارة عن موقع إلكتروني يساعدك في إنجاز مهامك بسهولة</p>
      </div>
    </div>
  );
}

export default LoginForm;

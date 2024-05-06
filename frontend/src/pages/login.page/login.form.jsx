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
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
      // Make a POST request to login
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        email,
        password,
      });

      console.log("Login successful:", response.data);

      // redirect user to the home page
      navigate("/", { replace: true });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        console.error("Login error:", error.response.data.detail);
        setError(error.response.data.detail);
      } else {
        console.error("Network error:", error.message);
        setError("حدث خطأ في الشبكة. الرجاء المحاولة مرة أخرى لاحقًا.");
      }
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100vh" }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} sx={{ padding: "20px" }}>
          <Typography variant="h5" align="center" gutterBottom>
            تسجيل الدخول
          </Typography>
          <form onSubmit={handleSubmit}>
            <label>البريد الإلكتروني</label>
            <TextField
              variant="outlined"
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
            <Typography align="center" sx={{ marginTop: "20px" }}>
              <Link to="/send-reset-code">نسيت كلمة المرور؟</Link>
            </Typography>
            <Button type="submit" variant="contained" fullWidth color="primary">
              تسجيل الدخول
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </form>
          <Typography align="center" sx={{ marginTop: "20px" }}>
            ليس لديك حساب؟ <Link to="/register">إنشاء حساب</Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default LoginForm;

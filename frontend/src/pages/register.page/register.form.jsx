import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
import axios from "axios";

function RegistrationForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make a POST request to register a new user
      const response = await axios.post("http://127.0.0.1:8000/register/", {
        username,
        email,
        password,
      });

      console.log("Registration successful:", response.data);

      // redirect user to the home page
      navigate("/", { replace: true });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.error("Registration error:", error.response.data.error);
        setError(error.response.data.error);
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
            إنشاء حساب
          </Typography>
          <form onSubmit={handleSubmit}>
            <label>اسم المستخدم</label>
            <TextField
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
            />
            <label>البريد الإلكتروني</label>
            <TextField
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <label>كلمة المرور </label>
            <TextField
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                // add eye button to show/hide password
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div className="instructions">
              <p>يجب أن تتكون كلمة المرور على 8 رموز على الأقل</p>
              <p>يجب أن تحتوي كلمة المرور على رموز و أرقام</p>
            </div>
            <Button type="submit" variant="contained" fullWidth color="primary">
              إنشاء حساب
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </form>
          <Typography align="center" sx={{ marginTop: "20px" }}>
            لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default RegistrationForm;

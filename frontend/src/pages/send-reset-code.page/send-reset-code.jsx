import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEmail } from "../../components/providers/email.provider";
import "./send-reset-code.css";
import { TextField, Button, Typography } from "@mui/material";

function SendResetCode() {
  const { setTempEmail } = useEmail();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      // Make a POST request to send reset code
      const response = await axios.post(
        "http://127.0.0.1:8000/send-reset-code/",
        { email }
      );
      const { email: responseEmail } = response.data;
  
      // set the email in context
      setTempEmail(responseEmail);
      navigate("/verify-reset-code", { replace: true });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("البريد الإلكتروني غير موجود.");
      }
    }
  };  

  return (
    <div className="reset-container">
      <div className="image-container">
        <img
          src={process.env.PUBLIC_URL + "images/forget_password1.png"}
          alt="إعادة كلمة المرور"
        />
        <h1>مل نسيت كمة المرور؟</h1>
        <p>
          {" "}
          لا تقلق هذا يحدث احيانا, الرجاء ادخال بريدك الالكتروني في الحقل المخصص
          وعند تاكيده سيتم إعادة تعيين كلمة المرور على بريدك الإلكتروني
        </p>
      </div>
      <div className="reset-form">
        <h1 className="title">إعادة تعيين كلمة المرور</h1>
        <form onSubmit={handleSubmit}>
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
          {error && <Typography color="error">{error}</Typography>}{" "}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            className="submit-button"
          >
            متابعة
          </Button>
          هل تدكرت كلمة المرور؟ <Link to="/login">تسجيل الدخول</Link>
        </form>
      </div>
    </div>
  );
}

export default SendResetCode;

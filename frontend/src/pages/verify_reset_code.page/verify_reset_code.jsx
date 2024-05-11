import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEmail } from "../../components/providers/email.provider";
import "./verify-reset-code.css";
import { TextField, Button, Typography } from "@mui/material";
import { Replay } from "@mui/icons-material";

function VerifyResetCode() {
  const navigate = useNavigate();
  const [setMessage] = useState("");
  const { email: email, setTempEmail } = useEmail();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [code, setCode] = useState(Array.from({ length: 6 }, () => ""));


  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/verify-reset-code/`,
        { email: email, code: code }
      );
      navigate("/reset-password", { replace: true });
      setSuccess(response.data.success);
    } catch (error) {
      console.error(error);
      setError(error.response.data.error);
    }
  };

  const handleResendCode = async (event) => {
    event.preventDefault();

    try {
      // Make a POST request to send reset code
      const response = await axios.post(
        "http://127.0.0.1:8000/send-reset-code/",
        { email }
      );
      // Get the email from the response
      const { email: responseEmail } = response.data;

      // Set the email in context
      setTempEmail(responseEmail);
      setMessage(response.data.message);
      setError("");
    } catch (error) {
      setMessage("");
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("A network error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="verify-container">
      <div className="image-container">
        <img
          src={process.env.PUBLIC_URL + "images/forget_password2.png"}
          alt="إعادة كلمة المرور"
        />
        <h1>التحقق من الرمز!</h1>
        <p>
          {" "}
          لقد تم إرسال رمز إلى بريدك الإلكتروني. الرجاء كتابته في الحقول المخصصة
          لبدء استرجاع كلمة المرور.
        </p>
      </div>
      <div className="verify-form">
        <h1>التحقق من الرمز</h1>
        <p>قم بإدخال الرمز المرسلة إلى بريدك الإلكتروني {email}</p>
        <TextField
          type="text"
          variant="outlined"
          fullWidth
          placeholder="Enter Code"
          onChange={(e) => setCode(e.target.value)}
          margin="normal"
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success">{success}</Typography>}
        <div>
          <Button
            onClick={handleResendCode}
            endIcon={<Replay />}
            variant="contained"
            fullWidth
            color="primary"
            className="submit-button"
          >
            إعادة الإرسال
          </Button>
        </div>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          className="submit-button"
          onClick={handleSubmit}
        >
          متابعة
        </Button>
        هل تدكرت كلمة المرور؟ <Link to="/login">تسجيل الدخول</Link>
      </div>
    </div>
  );
}

export default VerifyResetCode;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEmail } from "../../components/providers/email.provider";
import "./verify-reset-code.css";
import { TextField, Button, Typography } from "@mui/material";
import { Replay } from "@mui/icons-material";
import VerificationInput from "react-verification-input";

function VerifyResetCode() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { email: email, setTempEmail } = useEmail();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [code, setCode] = useState(Array.from({ length: 6 }, () => ""));

  const handleSubmit = async () => {
    try {
      console.log(email)
      const response = await axios.post(
        `http://127.0.0.1:8000/verify-reset-code/`,
        { email: email, code: code.split("").reverse().join("") }
      );
      navigate("/reset-password", { replace: true });
      setSuccess(response.data.success);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred. Please try again later.");
      }
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
        <p className="instr">
          قم بإدخال الرمز المرسلة إلى بريدك الإلكتروني {email}
        </p>
        <VerificationInput
          length={6}
          onChange={(value) => setCode(value)}
          direction="rtl"
          classNames={{
            container: "container",
            character: "character",
            characterInactive: "character--inactive",
            characterSelected: "character--selected",
            characterFilled: "character--filled",
          }}
        />
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success">{success}</Typography>}
        <div className="resend">
          <button onClick={handleResendCode} className="resend-button">
            إعادة الإرسال
          </button>
          <Replay className="resend-icon" />
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
        <Typography align="center" sx={{ marginTop: "20px" }} className="link">
          &nbsp;هل تدكرت كلمة المرور؟&nbsp;
          <Link to="/login" className="login-link">
            <span>تسجيل الدخول</span>
          </Link>
        </Typography>
      </div>
    </div>
  );
}

export default VerifyResetCode;

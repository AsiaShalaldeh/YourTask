import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEmail } from '../../components/providers/email.provider';

function SendResetCode() {
  const { setTempEmail } = useEmail();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
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
      navigate("/verify-reset-code", { replace: true });
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
    <div>
      <h1>إعادة تعيين كلمة المرور</h1>
      <form onSubmit={handleSubmit}>
        <label>الإيميل</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">متابعة</button>
        هل تدكرت كلمة المرور؟ <Link to="/login">تسجيل الدخول</Link>
        {error && <p>{error}</p>}
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default SendResetCode;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEmail } from "../../components/providers/email.provider";

function VerifyResetCode() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { email: email, setTempEmail } = useEmail();
  const codeInputs = useRef(
    Array.from({ length: 6 }).map(() => React.createRef())
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [code, setCode] = useState(Array.from({ length: 6 }, () => ""));

  //   useEffect(() => {
  //     codeInputs.current[0].current.focus();
  //   }, []);

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
      //   setError(error.response.data.error);
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
    <div>
      <h1>Verify Reset Code</h1>
      <p>Email: {email}</p>
      {/* <div>
        {code.map((digit, index) => (
          <input
            key={index}
            type="number"
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            ref={codeInputs.current[index]}
            style={{ width: "30px", marginRight: "5px" }}
          />
        ))}
      </div> */}
      <input
        type="text"
        placeholder="Enter code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleResendCode}>إعادة الإرسال</button>
      <button onClick={handleSubmit}>متابعة</button>
      {success && <p>{success}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default VerifyResetCode;

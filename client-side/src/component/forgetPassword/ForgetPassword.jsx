import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, Form } from "react-bootstrap";
import axios from "axios";

function ForgetPassword() {
  const [message, setMessage] = useState("");
  const [flage, setFlage] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const codeRef = useRef();
  const newpasswordRef = useRef();
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const data = {
        email: emailRef.current.value,
      };
      console.log(data.email);
      await axios
        .post(`http://localhost:4001/api/v1/auth/sendcode`, data)
        .then((res) => {
          if (res.data.message === "invalid account") {
            setError("invalid email");
          } else if (res.data.error === "invalid update") {
            setError("invlid data");
          } else if (res.data.message === "success") {
            setFlage(!flage);
            setMessage("success enter new password and code from email");
          }
        })
        .catch((err) => {
          setError("ther are an error");
        });
    } catch (err) {
      setError("fail to reset password");
    }
    setLoading(false);
  };
  const handelChane = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const data = {
        code: emailRef.current.value,
        newPassword: newpasswordRef.current.value,
        email: emailRef.current.value,
      };

      await axios
        .post(`http://localhost:4001/api/v1/auth/forgetpassword`, data)
        .then((res) => {
          if (res.data.error === "enter code") {
            setError("enter Code from gmail");
          } else if (res.data.error === "error code") {
            setError("try agian");
          } else if (res.data.message === "success") {
            setMessage("success,Go to login Page");
          }
        })
        .catch((err) => {
          setError("ther are an error");
        });
    } catch (err) {
      setError("fail to reset password");
    }
    setLoading(false);
  };
  return (
    <div style={{ maxWidth: "400px" }} className="m-auto mt-5">
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Forget Password</h2>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group>
              <Form.Label htmlFor="email">Enter Your email</Form.Label>
              <Form.Control
                type="email"
                id="email"
                ref={emailRef}
                disabled={flage}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="code">Code</Form.Label>
              <Form.Control
                type="text"
                id="code"
                ref={codeRef}
                disabled={!flage}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="newPassword">New Password</Form.Label>
              <Form.Control
                type="password"
                id="newPassword"
                ref={newpasswordRef}
                disabled={!flage}
              />
            </Form.Group>
            <div className="d-flex align-items-center justify-content-between">
              <Button
                variant="primary"
                type="submit"
                className="w-45 mt-3 "
                disabled={loading || !flage}
                onClick={handelChane}
              >
                Reset Password
              </Button>
              <Button
                variant="danger"
                type="submit"
                className="w-45 mt-3"
                onClick={handelSubmit}
                disabled={loading || flage}
              >
                sendCode
              </Button>
            </div>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/">Login page</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center ,t-2">
        Need an account ? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default ForgetPassword;

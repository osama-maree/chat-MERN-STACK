import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Form } from "react-bootstrap";
import axios from "axios";
// import { AuthContext } from "../../App";
import { AuthContext } from "../context/AuthContext.js";
function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      // console.log(emailRef.current.value);
      const data = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      // console.log("reeeeeeee");
      const res = await axios.post(
        `http://localhost:4001/api/v1/auth/signin`,
        data
      );

      if (res.data.error === "veryfing email")
        return setError("please Verifynig your email");
      else if (res.data.error === "Fail")
        return setError("error please try again");
      else if (res.data.message === "logged") {
        //  console.log(res)

        localStorage.setItem("token", res.data.information);

        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
        // console.log(user)
        //console.log(user)
        // console.log(localStorage.getItem('user'))
        navigate("/home");
      }
    } catch (err) {
      setError("error,please try again");
      console.log(err.message);
    }
    setLoading(false);
  };
  return (
    <div style={{ maxWidth: "400px" }} className="m-auto mt-5 ">
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handelSubmit}>
            <Form.Group>
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control type="email" id="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                type="password"
                id="password"
                ref={passwordRef}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              disabled={loading}
            >
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/forget-password">Forget Password</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center ,t-2">
        Need an account ? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default Login;

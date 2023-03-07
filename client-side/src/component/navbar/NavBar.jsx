import React, { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "./nav.css";
function NavBar() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || { img: "" };
  //console.log(user, "==================");
  const handelLogout = async () => {
    try {
      setError("");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      setError("Error in logout");
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);
  return (
    <div className="bg-light w-100">
      <div className="container">
        <div className="d-flex  justify-content-between py-2">
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="middle p-2">
            <img
              src={user.img}
              className="img-fluid stypePrivate me-3"
              alt=""
            />
            <strong>Email:</strong>
            {user.name}
          </div>
          <h2 className="text-center">Home Page</h2>

          <Button className="btn btn-primary" onClick={handelLogout}>
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NavBar;

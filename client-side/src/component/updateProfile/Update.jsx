import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function Update() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios
        .get("http://localhost:4001/api/v1/auth/getdata", {
          headers: { token: `osama__${localStorage.getItem("token")}` },
        })
        .then((res) => {
          setEmail(res.data.email);
          setAge(res.data.age);
          setGender(res.data.gender);
          setName(res.data.userName);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  const handelSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    const data = {
      name: name,
      age: age,
      gender: gender,
    };
    await axios
      .put(`http://localhost:4001/api/v1/auth/updateuser`, data, {
        headers: {
          token: `osama__${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.data.error === "failed") {
          setError("please try agian");
        } else if (response.data.error === "error token") {
          setError("You are not logged in");
        } else {
          navigate("/home");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setLoading(false);
  };
  return (
    <>
      <Card >
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handelSubmit}>
            <Form.Group>
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                type="email"
                id="email"
                value={email}
                readOnly
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Control
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="gender">Gender</Form.Label>
              <Form.Select
                type="textbox"
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="age">Age</Form.Label>
              <Form.Control
                type="number"
                id="age"
                min="12"
                max="90"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              disabled={loading}
            >
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/home">Cancel</Link>
      </div>
    </>
  );
}

export default Update;

import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthContext } from "./component/context/AuthContext.js";
import ForgetPassword from "./component/forgetPassword/ForgetPassword";
import Home from "./component/home/Home";
import Login from "./component/login/Login";
import Signup from "./component/signup/Signup";
import PageNotFound from "./PageNotFound";

function App() {
  const {user, dispatch } = createContext(AuthContext);
  useEffect(() => {
    if (localStorage.getItem("user")) {
      axios
        .get("http://localhost:4001/api/v1/auth/getdata", {
          headers: { token: `osama__${localStorage.getItem("token")}` },
        })
        .then((res) => {
          console.log(res);
          const user={
            name: res.data.userName,
            id: res.data.id,
            profilePic: res.data.profilePic,
          };
          dispatch({ type: "UPDATE", payload: user });
        
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, []);

  return (
    <div className="w-100">
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          {/* <Route path="/update-profile" element={<Update />} /> */}
          <Route path="/home" element={ <Home />}/>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

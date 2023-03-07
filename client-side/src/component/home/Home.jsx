import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import Message from "../message/Message.jsx";
import NavBar from "../navbar/NavBar.jsx";
import io from "socket.io-client";

import "./home.css";
import { AuthContext } from "../context/AuthContext.js";
const socket = io.connect("http://localhost:8800");

function Home() {
  const [conversation, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState([]);
  const [newmessage, setnewMessage] = useState("");
  const { user } = useContext(AuthContext);

  const scrollRef = useRef();
  const id = user.id;
  // useEffect(() => {
  //   if (localStorage.getItem("user")) {
  //     //  const user=localStorage.getItem("user")
  //     //  id=user.id
  //   }
  // }, []);
  useEffect(() => {
    socket.emit("join_room", "20"); //Incomplete must be sent on same socketNumber in same session
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const messagex = {
      to: currentChat?._id,
      message: newmessage,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:4001/api/v1/message/createMessage/" + id,
        messagex
      );
      data.id = "20";
      //  console.log(data)

      await socket.emit("send_message", data);
      setMessage((prev) => [...prev, data]);
      setnewMessage("");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const getConversation = async () => {
      const res = await axios.get(
        "http://localhost:4001/api/v1/message/getusers/" + id
      );
      console.log(res);
      setConversation(res.data);
    };
    getConversation();
  }, []);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const handlesubmit1 = async (c) => {
    setCurrentChat(c);
    const data = {
      to: c._id,
    };
    const res = await axios.post(
      "http://localhost:4001/api/v1/message/getallmessage/" + id,
      data
    );
    setMessage(res.data);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      data.fromSelf = false;
      setMessage((prev) => [...prev, data]);
    });
  }, []);

  return (
    <div>
      <NavBar />

      {/* <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link> */}

      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="chatBox">
              <div className="chatBoxWrapper">
                {currentChat ? (
                  <>
                    <div className="chatBoxTop">
                      {message.map((m, ind) => (
                        <div ref={scrollRef} key={ind}>
                          <Message key={ind} message={m} own={m.fromSelf} />
                        </div>
                      ))}
                    </div>
                    <div className="chatBoxBottom">
                      <textarea
                        className="chatMessageInput"
                        placeholder="write message"
                        value={newmessage}
                        onChange={(e) => setnewMessage(e.target.value)}
                      ></textarea>
                      <button
                        onClick={handleSubmit}
                        className="chatSubmitButton"
                      >
                        send
                      </button>
                    </div>
                  </>
                ) : (
                  <span>Open a conversation to start a chat </span>
                )}
              </div>
            </div>{" "}
          </div>
          <div className="col-md-4 leftBorder text-white">
            <div className="style1">
              {conversation.map((c, ind) => (
                <div
                  className="user p-3 mt-2"
                  onClick={() => handlesubmit1(c)}
                  key={ind}
                >
                  <img
                    src={c.profilePic}
                    className="img-fluid stypePrivate me-3"
                    alt=""
                  />
                  <strong>Name:</strong>
                  {c.userName}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

import "./message.css";
import { format } from "timeago.js";
function Message({ message, own }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img src={message?.profilePic} alt="" className="messageImg" />
        <p className="messageText">{message.message}</p>
      </div>

      <div className="messageBottom">{format(message?.createdAt)}</div>
    </div>
  );
}

export default Message;

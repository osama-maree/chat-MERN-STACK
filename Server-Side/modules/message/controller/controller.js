const MessageModel = require("../../../DB/model/messages.js");
const { userModel } = require("../../../DB/model/user.js");

const getMessages = async (req, res) => {
  try {
    const { to } = req.body;
    const { from } = req.params;

    const messages = await MessageModel.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    console.log(messages);
    const msgs = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        createdAt: msg.createdAt,
        profilePic: msg.profilePic,
      };
    });
    res.status(200).json(msgs);
  } catch (err) {
    res.status(400).json({ error: "internal error" });
  }
};

const createMessage = async (req, res) => {
  try {
    const { to, message } = req.body;
    const { from } = req.params;
    const user = await userModel.findById({ _id: from }).select("profilePic");
    const m = await MessageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
      profilePic: user.profilePic,
    });

    console.log(user);
    const savemessage = {
      fromSelf: true,
      message: m.message.text,
      createdAt: m.createdAt,
      profilePic: user.profilePic,
    };
    res.status(201).json(savemessage);
  } catch (err) {
    res.status(400).json({ error: "internal error" });
  }
};

const getAllusers = async (req, res) => {
  try {
    const users = await userModel
      .find({ _id: { $ne: req.params.id } })
      .select(["email", "userName", "profilePic", "_id"]);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: "internal error" });
  }
};
module.exports = {
  getMessages,
  createMessage,
  getAllusers,
};

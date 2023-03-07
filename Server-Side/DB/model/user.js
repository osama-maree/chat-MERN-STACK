const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
    },
    age: Number,
    profilePic: String,
    confirmEmail: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const userModel = mongoose.model("user", userSchema);
module.exports = { userModel };

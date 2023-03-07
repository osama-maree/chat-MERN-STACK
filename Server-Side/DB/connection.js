const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const connectDB = async () => {
  return await mongoose
    .connect("mongodb://localhost:27017/auth")
    .then((res) => {
      console.log("connection DB");
    })
    .catch((err) => {
      console.log("error from database");
    });
};

module.exports = connectDB;

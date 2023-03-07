const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const { userModel } = require("../../../DB/model/user");
const cloudinary = require("../../../services/cloudinary.js");
const { sendEmail } = require("../../../services/email");


const signup = async (req, res) => {
  try {
    const { name, email, password, gender, age } = req.body;
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      folder: "auth",
    });

    const user = await userModel.findOne({ email });

    if (user) {
      res.status(400).json({ message: "fail to singup" });
    } else {
      let hashpassword = await bcrypt.hash(
        password,
        parseInt(process.env.saltRound)
      );

      const newUser = new userModel({
        email: email,
        userName: name,
        password: hashpassword,
        gender: gender,
        age: age,
        profilePic: secure_url,
      });

      const Saveduser = await newUser.save();
      if (!Saveduser) res.status(404).json({ error: "fail to singup" });
      else {
        const token = await jwt.sign(
          { id: Saveduser._id },
          process.env.CONFIREMAIL,
          {
            expiresIn: "1h",
          }
        );

        let message = `
        <a href="${req.protocol}://${req.headers.host}${process.env.MYPATH}/auth/confirmEmail/${token}">verfy email</a>`;
        await sendEmail(email, "confirm email", message);
        res.status(201).json({ message: "added user" });
      }
    }
  } catch (err) {
    res.status(200).json({ error: err.message });
  }
};

const confirmEmail = async (req, res) => {
  const { token } = req.params;
  const decode = await jwt.verify(token, process.env.CONFIREMAIL);
  if (!decode) {
    res.json({ message: "invalid token" });
  }
  await userModel.findByIdAndUpdate(
    { _id: decode.id, confirmEmail: false },
    {
      confirmEmail: true,
    }
  );
  res.status(200).json({ message: "go to login website" });
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      res.status(400).json({
        error: "Fail",
      });
    } else {
      if (!user.confirmEmail) {
        res.status(400).json({ message: "veryfing email" });
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.LOGINTOKEN
          );


          
//console.log(user)
          res.status(200).json({
            message: "logged",
            information: token,
            id: user._id,
            Name: user.userName,
            image: user.profilePic,
          });
        } else {
          res.status(400).json({ error: "Fail" });
        }
      }
    }
  } catch (err) {
    console.log(err.stack);
  }
  
};
const updateUser = async (req, res) => {
  const { name, age, gender } = req.body;
  try {
    const pp = await userModel.findByIdAndUpdate(req.user._id, {
      userName: name,
      age: age,
      gender: gender,
    });

    if (pp) {
      res.status(200).json({ message: "success updated " });
    } else {
      res.status(400).json({ error: "failed" });
    }
  } catch (err) {
    res.status(200).json({ error: "failed" });
  }
};
const getAll = async (req, res) => {
  const Id = req.user.id;
  const user = await userModel.findOne({ _id: Id });
  res.status(200).json(user);
};

const ForgetPassword = async (req, res) => {
  const { code, email, newPassword } = req.body;
  if (!code) {
    res.json({ error: "enter code" });
  } else {
    const hash = await bcrypt.hash(
      newPassword,
      parseInt(process.env.saltRound)
    );
    const user = await userModel.findOneAndUpdate(
      { email: email, sendCode: code },
      { password: hash }
    );
    if (user) {
      res.status(200).json({ message: "success" });
    } else {
      res.status(400).json({ error: "error code" });
    }
  }
};
const sendCode = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email }).select("email");

  if (!user) {
    res.status(400).json({ message: "invalid account" });
  } else {
    const code = nanoid();
    await sendEmail(email, "Forget password", `verify code : ${code}`);
    const updateUser = await userModel.findOneAndUpdate(
      { email },
      { sendCode: code }
    );
    if (updateUser) {
      res.status(200).json({ message: "success" });
    } else {
      res.status(400).json({ error: "invalid sendCode" });
    }
  }
};

module.exports = {
  signup,
  confirmEmail,
  signIn,
  updateUser,
  getAll,
  sendCode,
  ForgetPassword,
};

const bcrypt = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ message: "Fill All Fields" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(401)
      .json({ message: "User Not Registered , sign up first" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: "Password is inCorrect" });
  }
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.status(200).json({ message: "login success", token: token });
});

//registerUser
const registerUser = expressAsyncHandler(async (req, res) => {
  const { fullname, email, password, role } = req.body;

  if (!fullname || !email || !password) {
    return res.status(401).json({ message: "Fill All Fields" });
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return res.status(401).json({ message: "Email is Already Register" });
  }

  //passwordHashing
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
    role,
  });

  if (!user) {
    return res.status(500).json({ message: "Internal Server error" });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.status(200).json({ message: "register success", token: token });
});

const authControllers = { loginUser, registerUser };

module.exports = authControllers;

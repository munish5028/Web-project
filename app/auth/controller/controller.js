const { USER } = require("../model/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("../../../middleware/nodemailer");

const auth = {};

auth.signup = async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.email || !data.password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const existingUser = await USER.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store the OTP in the user's document
    data.otp = otp;

    const user = await USER.create(data);
    if (user) {
      await nodemailer.verifyAccount(user.email);
      res.status(200).json({
        message: "User created successfully, please verify your email",
        data: user,
      });
    } else {
      res.status(400).json({ message: "User not created" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

auth.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(email, otp);

    if (!email || !otp) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const user = await USER.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (user.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await USER.findOneAndUpdate(
      { email: email },
      { verifyOtp: true },
      { new: true }
    );

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    console.log("error", error);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

auth.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const user = await USER.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!user.verifyOtp) {
      return res
        .status(401)
        .json({ message: "Please verify your email first" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "vbfg%$%$",
      {
        expiresIn: "1h",
      }
    );

    res
      .status(200)
      .json({ message: "Logged in successfully", data: user, token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





module.exports = auth;

// HTTP Status Codes

//     200 OK: Request was successful
//     400 Bad Request: Invalid request or malformed data
//     401 Unauthorized: Authentication or authorization failed
//     403 Forbidden: Access denied or permission issue
//     404 Not Found: Resource not found
//     500 Internal Server Error: Server-side error or unexpected condition
//     502 Bad Gateway: Server received an invalid response from an upstream server
//     503 Service Unavailable: Server is currently unavailable or overloaded

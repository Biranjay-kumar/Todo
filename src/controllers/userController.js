import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate all fields are present
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  if (password.length < 4) {
    return res
      .status(400)
      .json({ message: "Password should be at least 4 characters" });
  }

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating user" });
  }
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate request data
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill in the email" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill in the password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Validate password
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Set cookie with the token
    res.cookie("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Return success response with user name and id
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        id: user._id,
        name: user.name,
        token: token,
      },
    });
  } catch (error) {
    console.error("Error while logging in:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//find all user
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error while getting all users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { register, login, getAllUsers };

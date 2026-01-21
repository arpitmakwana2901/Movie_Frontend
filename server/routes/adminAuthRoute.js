const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const adminAuthRoute = express.Router();

// POST /admin-auth/register
// Creates the FIRST admin in the system (no invite code).
// If an admin already exists, registration is blocked and the user should login.
adminAuthRoute.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "userName, email, password are required",
      });
    }

    const adminCount = await UserModel.countDocuments({ role: "admin" });
    if (adminCount > 0) {
      return res.status(403).json({
        success: false,
        message: "Admin already exists. Please login.",
      });
    }

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const admin = await UserModel.create({
      userName,
      email,
      password: hashPassword,
      role: "admin",
    });

    const JWT_SECRET = process.env.SECRET_KEY || "arpit";

    const myToken = jwt.sign(
      {
        _id: admin._id,
        userName: admin.userName,
        email: admin.email,
        role: "admin",
      },
      JWT_SECRET,
      { expiresIn: "168h" }
    );

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      myToken,
    });
  } catch (error) {
    // Handle mongoose unique index errors
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST /admin-auth/login
// Login for admin users only
adminAuthRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin credentials required.",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const JWT_SECRET = process.env.SECRET_KEY || "arpit";

    const myToken = jwt.sign(
      {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: "admin",
      },
      JWT_SECRET,
      { expiresIn: "168h" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      myToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = adminAuthRoute;

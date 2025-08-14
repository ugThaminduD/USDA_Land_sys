const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModel = require("../models/User");



// Login User
const loginUser = async (req, res) => {
  try {
    const { un, pwd } = req.body;
    if (!un || !pwd) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    const user = await UserModel.findOne({ un });
    if (!user || !(await bcrypt.compare(pwd, user.pwd))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "10h" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        un: user.un,
        role: user.role,
      },
    });
    console.log(`User ${un} logged in successfully`);
    console.log(`Token: ${token}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create a new user (admin only)
const createUser = async (req, res) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const { un, pwd, role } = req.body;
    if (!un || !pwd) {
      return res.status(400).json({ message: "Username and password required" });
    }
    const existingUser = await UserModel.findOne({ un });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = new UserModel({ un, pwd: hashedPwd, role: role || "user" });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const users = await UserModel.find({}, "-pwd"); // Exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const user = await UserModel.findById(req.params.id, "-pwd");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const { un, pwd, role } = req.body;
    const updateData = { un, role };
    
    // Only hash password if provided
    if (pwd) {
      updateData.pwd = await bcrypt.hash(pwd, 10);
    }
    
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-pwd");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Username already exists" });
    }
    res.status(400).json({ error: error.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }
    
    await UserModel.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
  // ...other exports...
};
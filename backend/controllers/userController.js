const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModel = require("../models/User");

// Create a new employee
const createUser = async (req, res) => {
  try {

      const { email, employee_password, role, ...otherFields } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash the password before storing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(employee_password, salt);

      const newUser = new UserModel({
        email,
        employee_password: hashedPassword,
        role,
        ...otherFields,
      });

      await newUser.save();
      res
        .status(201)
        .json({ message: "Employee created successfully", employee });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};


// Login User
const loginUser = async (req, res) => {
  try {

      const { email, employee_password } = req.body;

      if (!email || !employee_password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      let user = await UserModel.findOne({ email, role: "admin" });
      if (!user) {
        user = await UserModel.findOne({ email });
      }

      if (!user || !(await bcrypt.compare(employee_password, user.employee_password))) {
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
          employee_name: user.employee_name,
          employee_id_number: user.employee_id_number,
          email: user.email,
          role: user.role,
        },
      });
      // console.log("Login Request received:", req.body, token);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};


// Get all employee users
const getAllUsers = async (req, res) => {
  try {

      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }

      const user = await UserModel.find().select("-employee_password"); // Exclude password

      res.status(200).json(user);

  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


// Get a single employee by ID
const getUserById = async (req, res) => {
  try {

      const user = await UserModel.findById(req.params.id).select(
        "-employee_password"
      );

      if (!user) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json(user);

  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


// Update an employee
const updateUser = async (req, res) => {
  try {

      const { employee_password, ...updateData } = req.body;

      // Hash new password if provided
      if (employee_password) {
        const salt = await bcrypt.genSalt(10);
        updateData.employee_password = await bcrypt.hash(employee_password, salt);
      }

      const user = await UserModel.findByIdAndUpdate(req.params.id, updateData,
        { new: true, runValidators: true }
      ).select("-employee_password");

      if (!user) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json({ message: "Employee updated successfully", employee });

  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};


// Delete an employee
const deleteUser = async (req, res) => {
  try {

      const user = await UserModel.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json({ message: "Employee deleted successfully" });
    
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


// Manage all user accounts(delete) => admin
const adminDeleteUser = async (req, res) => {
  try {

      if (req.user.role !== 'admin') {
          return res.status(403).json({ message: "Access denied. Admins only." });
      }

      const user = await UserModel.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      await user.deleteOne();
      res.json({ message: "User account deleted by admin" });

  } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
  }
};


module.exports = {
  createUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser, adminDeleteUser
};

const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await UserModel.findById(decoded.id).select("-employee_password");
      next();
    } else {
      throw new Error("Not authorized");
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { protect };

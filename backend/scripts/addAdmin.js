const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User");

const MONGO_DB_URL = "mongodb+srv://thamindud009:1234@cluster0.sp5xx.mongodb.net/USDA_Lands";

async function addAdmin() {
    await mongoose.connect(MONGO_DB_URL);
    const hashedPwd = await bcrypt.hash("admin@1234", 10);
    await UserModel.create({ un: "admin_un", pwd: hashedPwd, role: "admin" });
    console.log("Admin user created");
    process.exit();
}

addAdmin();
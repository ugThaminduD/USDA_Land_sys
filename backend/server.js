require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();



// Middleware
app.use(express.json());
// app.use(cors());
app.use(cors({ origin: 'http://localhost:3000' }));



// DB onnection => MongoDB
const MONGO_DB_URL = process.env.MONGO_DB_URL;
mongoose
  .connect(MONGO_DB_URL)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("DB connection error", err);
    process.exit(1);

  });



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// testing => Prevent starting the server when running tests
// if (process.env.NODE_ENV !== 'test') {
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }



// Routes
// const UserRoutes = require("./routes/userRoutes");
// app.use(UserRoutes);

const LandRoutes = require("./routes/landRoutes");
app.use(LandRoutes);



module.exports = app;

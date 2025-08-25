require("dotenv").config();
require("./config/gridfs");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();


// Update CORS configuration
// const corsOptions = {
//   origin: process.env.NODE_ENV === 'production' 
//     ? [
//         'https://usda-land-frontend.onrender.com', ///// Replace with your actual frontend URL
//         /\.onrender\.com$/
//       ]
//     : ["http://localhost:3000"],
//   credentials: true,
//   optionsSuccessStatus: 200
// };



// Middleware
app.use(express.json());
// app.use(cors(corsOptions));
// app.use(cors());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));


const API_KEY = process.env.API_KEY; // fallback only for development

// Middleware to check API key in request headers
function checkAPIKey(req, res, next) {
  const apiKey = req.headers["authorization"];
  if (apiKey && apiKey === `Bearer ${API_KEY}`) {
    return next();
  } else {
    return res.status(403).send("Forbidden: Invalid API Key");
  }
}

// DB onnection => MongoDB
const MONGO_DB_URL = process.env.MONGO_DB_URL;
mongoose
  .connect(MONGO_DB_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
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


// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}




// Routes
const UserRoutes = require("./routes/userRoutes");
app.use("/api/users", UserRoutes);

const LandRoutes = require("./routes/landRoutes");
app.use(LandRoutes);
// app.use(checkAPIKey, LandRoutes);

app.use("/uploads", express.static("uploads"));
app.use('/api', require('./routes/landRoutes'));

const ExcelRoutes = require("./routes/excelRoutes");
app.use(ExcelRoutes);








module.exports = app;

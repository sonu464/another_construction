const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");

const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");
const feedRoutes = require("./routes/feed");
const postRoutes = require("./routes/post");

const app = express();
dotenv.config();

// Middleware setup
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Rename file if needed
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Multer upload instance
const upload = multer({ storage });

// Use authRoutes for authentication
app.use("/auth", authRoutes);

// Use eventRoutes for /events endpoint
app.use("/events", eventRoutes);

// Use feedRoutes for /user/feed endpoint
app.use("/user", feedRoutes);

// Use postRoutes for /user/post endpoint with file upload
app.use("/user", upload.single("postUrl"), postRoutes);

// Global error handling middleware
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});

const PORT = process.env.PORT || 8080;

// Start server and connect to database
app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("Connected to Database");
    console.log(`Server is running on port no. ${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});

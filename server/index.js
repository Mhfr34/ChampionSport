const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const router = require("./routes");

const app = express();

// Middleware to handle JSON body parsing
app.use(express.json());
app.use(cookieParser());

// CORS configuration to allow credentials and specify frontend origin
app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
  credentials: true,  // Allow cookies to be sent
}));

// Route middleware
app.use("/api", router);


// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to the database and start the server
const PORT = process.env.PORT || 8080; // Fixing the port precedence

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Connected to DB");
    console.log("Server is running on port " + PORT);
  });
});

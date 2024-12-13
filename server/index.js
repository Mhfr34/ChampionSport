const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const router = require("./routes");

require("dotenv").config();

const app = express();

// Middleware to handle JSON body parsing
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// CORS middleware configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials like cookies, headers
  })
);

// Route middleware
app.use("/api", router);

// Connect to database
const PORT = process.env.PORT || 8080;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Connected to DB");
    console.log(`Server is running on port ${PORT}`);
  });
});

const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const router = require("./routes");
require("dotenv").config();

const app = express();

// Middleware to handle JSON body parsing
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// CORS middleware function
const allowCors = (fn) => async (req, res) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin); // Allow specific origin
  }

  res.setHeader('Access-Control-Allow-Credentials', true); // Allow credentials (cookies, etc.)
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT'); // Allow methods
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  ); // Allow headers

  // Handle preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Call the actual route handler
  return await fn(req, res);
};

// Use the CORS middleware for all routes
app.use("/api", allowCors(router));

// Connect to the database
connectDB().then(() => {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log("Connected to DB");
    console.log(`Server is running on port ${PORT}`);
  });
});

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const router = require("./routes");
const cookieParser = require("cookie-parser");


// Initialize dotenv to load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());




// CORS middleware function
const allowCors = (fn) => async (req, res) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight requests (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Call the actual request handler function
    return await fn(req, res);
};

// Apply CORS middleware to all routes under /api
app.use("/api", allowCors(router));

// Connect to database
const PORT = process.env.PORT || 8080;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Connected to DB");
        console.log(`Server is running on port ${PORT}`);
    });
});
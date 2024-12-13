const bcrypt = require("bcryptjs");
const userModel = require("../../models/userModel");
const jwt = require("jsonwebtoken");

async function userSignInController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
        error: true,
      });
    }
    if (!password) {
      return res.status(400).json({
        message: "Password is required",
        success: false,
        error: true,
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword) {
      const tokenData = {
        _id: user._id,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60 * 8, // Token expiration set to 8 hours
      });

      const tokenOption = {
        httpOnly: true,
        secure: true,
      };

      res
        .cookie("token", token, tokenOption)
        .status(200)
        .json({
          message: "Login successfully",
          data: {
            token, // send the token
            role: user.role, // send the user's role
            _id: user._id,
          },
          success: true,
          error: false,
        });
    } else {
      return res.status(401).json({
        message: "Incorrect password",
        success: false,
        error: true,
      });
    }
  } catch (err) {
    // Log the error for server-side debugging
    console.error("Sign-in error:", err);

    // Send a generic error message to the client
    res.status(500).json({
      message: "Service is currently unavailable. Please try again later.",
      success: false,
      error: true,
    });
  }
}

module.exports = userSignInController;

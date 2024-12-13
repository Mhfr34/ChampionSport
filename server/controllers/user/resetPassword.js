const bcrypt = require("bcryptjs");
const userModel = require("../../models/userModel");

async function resetPassword(req, res) {
  try {
    const { token } = req.params; // The token is passed in the URL
    const { newPassword } = req.body;

    // Find the user by reset token and check expiration
    const user = await userModel.findOne({
      resetPasswordExpires: { $gt: Date.now() }, // Token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Compare the reset token with the stored hashed token
    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isTokenValid) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

   res.status(200).json({ success: true, message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

module.exports = resetPassword;

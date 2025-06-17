const User = require('../models/user'); // Adjust the path as needed
const bcrypt = require('bcryptjs');

// GET profile data
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated
    const user = await User.findById(userId).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE profile info (name/email)
exports.updateProfile = async (req, res) => {
  const { username, email } = req.body;

  try {
    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

// UPDATE password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE account
exports.deleteAccount = async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete account', error: err.message });
  }
};

// (Optional) Deactivate account — here we just hide the account
exports.deactivateAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { deactivated: true }); // Add `deactivated` field if needed

    res.status(200).json({ message: 'Account deactivated' });
  } catch (err) {
    res.status(500).json({ message: 'Deactivation failed', error: err.message });
  }
};

exports.updateProfilePic = async (req, res) => {
  const { profilePic } = req.body;
  try {
    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic },
      { new: true, runValidators: true }
    ).select('-password');
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update profile picture', error: err.message });
  }
};

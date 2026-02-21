const User = require('../models/User');

// GET /api/users/me
const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/users/register
const registerUser = async (req, res) => {
  const { email, displayName, conditions } = req.body;
  const firebaseUid = req.user.uid;

  try {
    let user = await User.findOne({ firebaseUid });
    if (user) {
      return res.status(200).json(user);
    }

    user = await User.create({
      firebaseUid,
      email: email || req.user.email,
      displayName: displayName || req.user.name || '',
      profile: {
        conditions: conditions || {},
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/users/me
const updateProfile = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMe, registerUser, updateProfile };

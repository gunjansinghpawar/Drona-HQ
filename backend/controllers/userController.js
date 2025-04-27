const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // Check if the email or name already exists
    const userExists = await User.findOne({ $or: [{ email }, { name }] });
    if (userExists) {
      return res.status(400).json({ message: 'Email or name already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      status:'active',
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
}

// Login a user
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error });
  }
}

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
}

// Get a user by ID
async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
}

// Update a user's details
async function updateUser(req, res) {
  try {
    const { name, email, password, role,status } = req.body;

    // Check if email or name already exists (for update)
    const userExists = await User.findOne({
      $or: [{ email }, { name }],
      _id: { $ne: req.params.id } // Exclude current user
    });
    if (userExists) {
      return res.status(400).json({ message: 'Email or name already exists' });
    }

    // Hash the password if it is being updated
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        password: hashedPassword || undefined,
        role,
        status,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
}

// Delete a user
async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
}

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

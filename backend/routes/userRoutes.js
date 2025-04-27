const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /register - Register a new user
router.post('/register', userController.register);

// POST /login - Login an existing user
router.post('/login', userController.login);

// GET /users - Get all users
router.get('/users', userController.getAllUsers);

// GET /user/:id - Get a user by ID
router.get('/:id', userController.getUserById);

// PUT /user/:id - Update a user by ID
router.put('/:id', userController.updateUser);

// DELETE /user/:id - Delete a user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;

const express = require('express');
const usersController = require('../controllers/users');

const router = express.Router();

router.get('/users', usersController.getAllUsers);
router.post('/users', usersController.createUser);
router.put('/users/:id', usersController.updateUser);

module.exports = router;
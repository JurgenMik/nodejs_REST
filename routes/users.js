const dotenv = require("dotenv");
const express = require('express');
const jwt = require('jsonwebtoken');

const usersController = require('../controllers/users');
dotenv.config();

const router = express.Router();

router.get('/jwt', (req, res) => {
    let privateKey = process.env.KEY;
    let token = jwt.sign({ "body" : "secret" },
        privateKey, { algorithm: 'HS256'});
    res.send(token);
})
router.get('/users', isAuthenticated, usersController.getAllUsers);
router.post('/users', isAuthenticated, usersController.createUser);
router.put('/users/:id', isAuthenticated, usersController.updateUser);
router.delete('/users/:id', isAuthenticated, usersController.deleteUser);

function isAuthenticated(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        let token = req.headers.authorization.split(" ")[1];
        let privateKey = process.env.KEY;

        jwt.verify(token, privateKey, { algorithm : 'HS256'}, (err, user) => {
            if (err) {res.status(500).json({ error: "Not authorized" });
                throw new Error("Not authorized");
            }
            return next();
        })
    } else {
        res.status(500).json({ error: "Please include a token in request header"});
        throw new Error("Not authorized");
    }
}

module.exports = router;
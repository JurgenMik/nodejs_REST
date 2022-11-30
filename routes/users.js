const dotenv = require("dotenv");
const express = require('express');
const fs = require('fs');
const readline = require('readline');
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

router.get('/logs', async (req, res) => {
    const lines = [];
    const lineReader = readline.createInterface({
        input: fs.createReadStream('log.txt'),
        crlfDelay: Infinity
    });

    for await (const line of lineReader) {
        const fields = line.match(/(\\.|[^,])+/g);

        lines.push({
            timestamp: fields[0],
            originalUrl: fields[1],
            method: fields[2],
            clientId: fields[3]
        });
    }
    return res.send(lines);
})

router.get('/users', usersController.getAllUsers);
router.post('/users', [isAuthenticated, log], usersController.createUser);
router.put('/users/:id', [isAuthenticated, log], usersController.updateUser);
router.delete('/users/:id', [isAuthenticated, log], usersController.deleteUser);

function isAuthenticated(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        let token = req.headers.authorization.split(" ")[1];
        let privateKey = process.env.KEY;

        jwt.verify(token, privateKey, { algorithm : 'HS256'}, (err, user) => {
            if (err) {res.status(401).json({ error: "Not authorized" });
                throw new Error("Not authorized");
            }
            return next();
        })
    } else {
        res.status(401).json({ error: "Please include a token in request header"});
        throw new Error("Not authorized");
    }
}

function log(req, res, next) {
   const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

   token = req.headers.authorization;
   let [header, payload, signature] = token.split(".");

   fs.appendFile('log.txt', timestamp + ',' + req.originalUrl + ',' + req.method + ',' + signature + ' \r\n', function(err) {
       if (err) throw err;
   });
   next();
}

module.exports = router;
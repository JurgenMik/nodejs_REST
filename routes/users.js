const dotenv = require("dotenv");
const express = require('express');
const fs = require('fs');
const readline = require('readline');
const jwt = require('jsonwebtoken');

//const usersController = require('../controllers/users');
const prismaUsersController = require('../controllers/users.prisma');
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
            clientId: fields[3],
            dataDiff: fields[4]
        });
    }
    return res.send(lines);
})

router.get('/users', prismaUsersController.getAllUsers);
router.post('/users', [isAuthenticated, log], prismaUsersController.createUser);
router.put('/users/:id', [isAuthenticated, log], prismaUsersController.updateUser);
router.delete('/users/:id', [isAuthenticated, log], prismaUsersController.deleteUser);

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

async function log(req, res, next) {
   const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

   token = req.headers.authorization;
   let [header, payload, signature] = token.split(".");

   let dataDiff;
   if (req.method === 'PUT') { dataDiff = JSON.stringify(diff(req.body, (await prismaUsersController.getOneUser(req.params.id, res)))).replace(/[{\"\",}]+/g, " "); }

   fs.appendFile('log.txt', timestamp + ',' + req.originalUrl + ',' + req.method + ',' + signature + ',' + dataDiff + ' \r\n', function(err) {
       if (err) throw err;
   });
   next();
}

function diff(stateOne, stateTwo) {
    function getUniqueKeys(stateOne, stateTwo) {
        let keys = Object.keys(stateOne).concat(Object.keys(stateTwo));
        return keys.filter(function (item, pos) {
            return keys.indexOf(item) === pos;
        });
    }

    let initial = {state: "Old"};
    let result = {state: "New"};

    let reference = [];
    for (let k of getUniqueKeys(stateOne, stateTwo)) {
        if (stateOne[k] !== stateTwo[k]) {
            initial[k] = stateTwo[k]
            result[k] = stateOne[k]
        }
    }
    reference.push(initial, result);

    return reference;
}

module.exports = router;
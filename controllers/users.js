const Users = require('../models/users');

const dateTime = require('node-datetime');
const dt = dateTime.create();
const formatted = dt.format('Y-m-d H:M:S');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await Users.find({});

        res.status(200).json({
            page: 1,
            per_page: 6,
            total: 1,
            total_pages: 2,
            users,
            support: {
                url: "https//reqres.in/#support-heading",
                text: "To keep ReqRes free, contributions towards server costs are appreciated!"
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400);
    }
}

exports.createUser = async (req, res) => {
    try {
        const user = await Users.create(req.body);

        res.status(201).json({
            user,
            createdAt: formatted
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Could not create a new user'
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        await authorize(req);
        const {id: userId} = req.params;
        const user = await Users.findOneAndUpdate({_id: userId}, req.body, {
            new: true,
        });

        res.status(200).json({
            user,
            updatedAt: formatted
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {return res.status(400).json({message: 'Invalid Id'})}
        return res.status(403).send();
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await authorize(req);
        const {id: userId} = req.params;
        await Users.findOneAndDelete({_id: userId});

        return res.status(204).end();
    } catch (error) {
        if (error.kind === 'ObjectId') {return res.status(400).json({message: 'Invalid Id'})}
        return res.status(403).send();
    }
}

async function authorize(req) {
    const {id: userId} = req.params;
    const clientToken = req.headers.authorization.split(" ")[1];

    const userObj = await Users.findOne({_id: userId});

    if (userObj.token !== clientToken) {throw new Error()}
}

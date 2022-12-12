const dateTime = require('node-datetime');
const dt = dateTime.create();
const formatted = dt.format('Y-m-d H:M:S');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient;

exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
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
    } catch(error){
        console.log(error);
        return res.status(400);
    }
}

exports.createUser = async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                avatar: req.body.avatar,
                token: req.body.token,
            },
        })
        return res.status(201).json({
            user,
            createdAt: formatted
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Could not create a new user'});
    }
}

exports.updateUser = async (req, res) => {
    try {
        await authorize(req);
        const user = await prisma.user.update({
            where: {
                id: req.params.id,
            },
            data: {
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                avatar: req.body.avatar,
                token: req.body.token,
            },
        });
        res.status(200).json({
            user,
            updatedAt: formatted
        });
    } catch (error) {
        if (error.code === 'P2023') {return res.status(400).json({message: 'Invalid Id'})}
        return res.status(403).send();
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await authorize(req);
        await prisma.user.delete({
            where: {
                id: req.params.id,
            },
        });
        return res.status(204).end();
    } catch (error) {
        if (error.code === 'P2023') {return res.status(400).json({message: 'Invalid Id'})}
        console.log(error)
        return res.status(403).send();
    }
}

exports.getOneUser = async (id, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        })
        return {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar
        }
    } catch (error) {
        return res.status(404).json({message: 'Invalid Id'})
    }
}

async function authorize(req) {
    const clientToken = req.headers.authorization.split(" ")[1];

    const userObj = await prisma.user.findUnique({
        where: {
            id: req.params.id
        }
    });
    if (userObj.token !== clientToken) {throw new Error()}
}
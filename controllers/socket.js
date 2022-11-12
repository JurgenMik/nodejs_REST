const Users = require('../models/users');

const getAllUsers = (io) => {
    Users.find({})
        .then(users => io.emit('get/users', users));
}

const createUser = (io, data) => {
    Users.create(data)
        .then(() => getAllUsers(io));
}

const updateUser = (io, data) => {
    Users.findOneAndUpdate({ _id: data._id}, data, {
        new: true,
    }).then(() => getAllUsers(io));
}

const deleteUser = (io, id) => {
    Users.findOneAndDelete({ _id: id})
        .then(() => getAllUsers(io));
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}
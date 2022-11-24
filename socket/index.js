const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/socket');

module.exports = (io) => {
    io.on('connect', socket => {
        console.log(socket.id);

        socket.on('get/users', () => getAllUsers(io));

        socket.on('create/user', (data) => createUser(io, data));

        socket.on('update/user', (data) => updateUser(io, data));

        socket.on('delete/user', (id) => deleteUser(io, id));

        io.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    });
}


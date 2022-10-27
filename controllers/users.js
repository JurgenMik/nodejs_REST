const Users = require('../models/users');

exports.getAllUsers = async (req, res) => {
    try {
       const users = await Users.find({})

        res.status(200).json({
            page: "1",
            per_page: "6",
            total: "12",
            total_pages: "2",
            users,
            support: {
                url: "https//reqres.in/#support-heading",
                text: "To keep ReqRes free, contributions towards server costs are appreciated!"
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(400)
    }
}
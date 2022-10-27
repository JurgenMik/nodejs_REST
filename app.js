const express = require('express');
const app = express()
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config()

// db
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to DB'))

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
})

const userRoutes = require('./routes/users');

app.use(cors());
app.use(bodyParser.json());
app.use("/api", userRoutes);

const port = process.env.PORT || 3002;
app.listen(3002, () => {
    console.log(`Server started on port: ${port}`);
});
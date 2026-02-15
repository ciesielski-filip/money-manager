const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Połączenie z MongoDB
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
}

// const usersRouter = require('./routes/users');
// app.use('/users', usersRouter);

// Eksport aplikacji do Vercel
module.exports = app;

// Lokalny start serwera
if (require.main === module) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

const userModel = require("./models/User")

app.post("/create-user", async (req, res) => {
    console.log(req.body)
    const userName = req.body.userName

    try {
        await userModel.create({ name: userName })
        res.json({ status: "ok" })
    } catch (error) {
        res.json({ status: error })
    }
})

app.get("/users", async (req, res) => {
    userModel.find()
        .then(users => res.json(users))
        .catch(err => res.json(err))
})
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// router.get('/', async (req, res) => {
//     try {
//         const users = await User.find();
//         res.json({ status: "ok", data: users });
//     } catch (err) {
//         res.status(500).json({ status: "error", message: err.message });
//     }
// });

// router.post('/', async (req, res) => {
//     const user = new User({
//         name: req.body.name,
//     });

//     try {
//         const newUser = await user.save();
//         res.status(201).json({ status: "ok", data: newUser });
//     } catch (err) {
//         res.status(400).json({ status: "error", message: err.message });
//     }
// });

// module.exports = router;
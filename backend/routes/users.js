const express = require('express');
const UserModel = require('../models/user');
const db = require('../db');
const jwt = require('jsonwebtoken');

const usersRouter = express.Router();

// usersRouter.post('/signup', (req, res) => {
//     db.findOne(UserModel, { username: req.body.username })
//         .then((user) => {
//             if (user) {
//                 res.status(400).json({ msg: "username already exists" });
//             }
//             db.create(UserModel, req.body)
//                 .then(() => {
//                     res.status(200).json({ msg: "Data successfully added to database" });
//                 })
//                 .catch((err) => {
//                     res.status(500).json(err);
//                 })
//         }).catch((err) => {
//             res.status(500).json(err);
//         })
// });

usersRouter.post('/signin', (req, res) => {
    db.findOne(UserModel, { username: req.body.username, password: req.body.password })
        .then((user) => {
            if (user) {
                res.status(200).json({ accessToken: jwt.sign({ username: user.username, password: user.password }, 'shehab') });
            } else {
                res.status(401).json({ msg: "username or/and password is wrong." })
            }
        })
        .catch((err) => {
            res.status(500).json(err);
        })
});


// usersRouter.get(':username', (req, res) => {
//     db.findOne(UserModel, { username: req.params.username })
//         .then(data => res.status(200).json(data))
//         .catch((err) => { res.status(500).json(err) })
// });


module.exports = usersRouter

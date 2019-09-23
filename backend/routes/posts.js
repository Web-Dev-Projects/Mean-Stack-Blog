const PostModel = require('../models/post')
const authenticate = require('../middlewares/authenticate');
const express = require('express')
const db = require('../db')

const postsRouter = express.Router();

postsRouter.post('', [authenticate],
    (req, res) => {
        db.create(PostModel, req.body)
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                console.log("in posting new post", err);
                res.status(500).json(err);
            });
    }
);

postsRouter.get('', (req, res) => {
    db.find(PostModel, {})
        .then(data => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log("in getting posts", err);
            res.status(500).json(err);
        })
});

postsRouter.get('/:id', (req, res) => {
    db.findOne(PostModel, { _id: req.params.id })
        .then(data => {
            res.status(200).json(data)
        })
        .catch((err) => {
            console.log("in changing rating ", err);
            res.status(404).json({ msg: "user id is wrong or invalid" });
        })
});


postsRouter.put('/view/:id', (req, res) => {
    db.incFieldsWithValues(PostModel, req.params.id, ["viewsNum"], [1])
        .then(() => {
            res.status(200).json({ msg: "num of views increased by 1" });
        })
        .catch((err => {
            console.log("increase views num", err);
            res.status(500).json({ errMsg: "fail in increasing views num" });
        }))

});


postsRouter.put('/comment/:id', (req, res) => {
    db.incFieldsWithValues(PostModel, req.params.id, ["commentsNum"], [1])
        .then(() => {
            res.status(200).json({ msg: "num of comments increased by 1" });
        })
        .catch((err => {
            console.log("increase comments num", err);
            res.status(500).json({ errMsg: "fail in increasing comments num" });
        }))

});


postsRouter.put('/report/:id', (req, res) => {
    db.addElemToList(PostModel, req.params.id, "reports", req.body)
        .then((post) => {
            res.status(200).json(post);
        })
        .catch((err => {
            console.log("in adding new report ", err);
            res.status(500).json({ errMsg: "fail in increasing comments num" });
        }))

});

module.exports = postsRouter
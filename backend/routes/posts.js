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



// itemsRouter.put('/comments/:id', (req, res) => {
//     db.addElemToList(PostModel, req.params.id, req.body, "comments", true)
//         .then(data => res.status(200).json(data))
//         .catch((err) => { res.status(404).json(err) })
// });

// itemsRouter.put('/ratings/:id', authenticate, (req, res) => {
//     db.findOne(PostModel, { '_id': req.params.id })
//         .then(data => {
//             let listName = "ratings";
//             let listFilter = { "username": req.body.username };
//             let newValue = { "value": req.body.value };

//             db.upsertElemToList(PostModel, req.params.id, listName, newValue, listFilter)
//                 .then(() => { res.status(200).json({ msg: "Data successfully modified" }); })
//                 .catch((err => { res.status(500).json(err) }))

//         })
//         .catch(err => {
//             console.log("in changing rating ", err);
//             res.status(404).json({ msg: "user id is wrong or invalid" });
//         });
// });

// itemsRouter.post('/userRating/:id', authenticate, (req, res) => {
//     db.findOne(PostModel, { _id: req.params.id }, { ratings: { "$elemMatch": { username: req.body.username } } })
//         .then(data => {
//             let rating = (data.ratings.length) ? data.ratings[0].value : 0;
//             res.status(200).json(rating)
//         })
//         .catch(err => {
//             console.log("in getting user rating", err);
//             res.status(404).json({ msg: "user id is wrong or invalid" });
//         });

// });

// itemsRouter.get('/download/:id', (req, res) => {
//     db.findOne(PostModel, { '_id': req.params.id })
//         .then(data => {
//             db.incFieldsWithValues(PostModel, req.params.id, ["downloadsNum"], [1])
//                 .then(() => {
//                     let fileLocation = path.join(process.env.FILESPATH, data.exeFileSrc);
//                     res.status(200).download(fileLocation, data.exeFileSrc);
//                 })
//                 .catch((err => { console.log("in file download", err); res.status(500).json(err) }))
//         })
//         .catch(err => res.status(404).json(err));
// });

module.exports = postsRouter
const PostModel = require('../models/post')
const authenticate = require('../middlewares/authenticate');
const express = require('express')
const formParser = require('../middlewares/form-parser')
const fileSaver = require('../middlewares/file-saver')
const tokenDecoder = require('../middlewares/access-token-decode')
const db = require('../db')
const path = require('path')
const fs = require('fs')
const postsRouter = express.Router();

postsRouter.post('', [tokenDecoder, authenticate, formParser, fileSaver],
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
            data = data.map((doc => {
                doc = doc.toObject();

                doc.viewsNum = doc.postUsers.viewers.length;
                doc.likers = doc.postUsers.likers;
                delete doc.postUsers;
                return doc;
            }))

            res.status(200).json({ sid: req.headers.sid, data: data });
        })
        .catch((err) => {
            console.log("in getting posts", err);
            res.status(500).json(err);
        })
});

postsRouter.get('/:id', (req, res) => {
    db.findOne(PostModel, { _id: req.params.id })
        .then(data => {
            data = data.toObject();
            if (data) {
                data.viewsNum = data.postUsers.viewers.length;
                data.likers = data.postUsers.likers;
                delete data.postUsers;
                res.status(200).json({ sid: req.headers.sid, data: data })
            } else {
                res.status(404).json({ msg: "user id is wrong or invalid" });
            }
        })
        .catch((err) => {
            console.log("in changing rating ", err);
            res.status(404).json({ msg: "user id is wrong or invalid" });
        })
});


postsRouter.put('/view/:id', (req, res) => {
    PostModel.findOneAndUpdate({ _id: req.params.id }, { $addToSet: { "postUsers.viewers": req.headers.sid } }, { useFindAndModify: false, new: true })
        .then((data) => {
            res.status(200).json({ sid: req.headers.sid, data: data.postUsers.viewers.length });
        })
        .catch((err => {
            console.log("increase views num", err);
            res.status(500).json({ errMsg: "fail in increasing views num" });
        }))
});

postsRouter.put('/like/:id', (req, res) => {
    if (req.body.like === true) {
        PostModel.findOneAndUpdate({ _id: req.params.id }, { $addToSet: { "postUsers.likers": req.headers.sid } }, { useFindAndModify: false, new: true })
            .then((data) => {
                res.status(200).json({ sid: req.headers.sid, data: data.postUsers.likers });
            })
            .catch((err => {
                console.log("in likers", err);
                res.status(500).json({ errMsg: "fail in changing likers" });
            }))
    } else {
        PostModel.findOneAndUpdate({ _id: req.params.id }, { $pull: { "postUsers.likers": req.headers.sid } }, { useFindAndModify: false, new: true })
            .then((data) => {
                res.status(200).json({ sid: req.headers.sid, data: data.postUsers.likers });
            })
            .catch((err => {
                console.log("in likers", err);
                res.status(500).json({ errMsg: "fail in changing likers" });
            }))
    }
});

postsRouter.put('/comment/:id', (req, res) => {
    db.incFieldsWithValues(PostModel, req.params.id, ["commentsNum"], [1])
        .then(() => {
            res.status(200).json({ sid: req.headers.sid, data: {} });
        })
        .catch((err => {
            console.log("increase comments num", err);
            res.status(500).json({ errMsg: "fail in increasing comments num" });
        }))

});


postsRouter.put('/report/:id', (req, res) => {
    db.addElemToList(PostModel, req.params.id, "reports", req.body)
        .then((post) => {
            res.status(200).json({ sid: req.headers.sid, data: post });
        })
        .catch((err => {
            console.log("in adding new report ", err);
            res.status(500).json({ errMsg: "fail in increasing comments num" });
        }))

});

postsRouter.put('/content/:id', [tokenDecoder], (req, res) => {
    if (req.headers.decodedtoken) {
        res.status(500).json({ msg: "Admin is not allowd" });
    } else {
        PostModel.updateOne(
            { _id: req.params.id, "contentComments.contentSegment": { $ne: req.body.contentSegment } },
            { $push: { contentComments: { contentSegment: req.body.contentSegment, comments: [] } } }
        ).then(() => {
            PostModel.updateOne({ _id: req.params.id, "contentComments.contentSegment": req.body.contentSegment },
                { $push: { "contentComments.$.comments": { name: req.body.name, text: req.body.comment } } })
                .then(() => {
                    res.status(200).json({ msg: "comment sent sucessfyly" });
                })
                .catch(err => {
                    console.log("in commenting on post content ", err);
                    res.status(500).json(err);
                });
        }).catch(err => {
            console.log("in commenting on post content ", err);
            res.status(404).json(err);
        });
    }
})

postsRouter.get('/content/:id', [tokenDecoder], (req, res) => {

    db.findOne(PostModel, { '_id': req.params.id })
        .then(data => {
            let filePath = path.join(process.env.FILESPATH, data.contentFileSrc);

            if (req.headers.decodedtoken) {
                PostModel.findOne({ '_id': req.params.id }, { contentComments: 1, "contentComments.comments": 1, "contentComments.contentSegment": 1 })
                    .then((data) => {
                        let text = insertElemnts(fs.readFileSync(filePath, 'utf8'), data.contentComments);
                        res.status(200).json({ content: text });
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
            else {
                let text = insertElemnts(fs.readFileSync(filePath, 'utf8'));
                res.status(200).json({ content: text });
            }
        })
        .catch(err => {
            console.log("in getting post content ", err);
            res.status(404).json(err);
        });
});



function insertElemnts(fileText, contentComments = null) {

    newFileData = '';
    count = 1;
    openCode = false;
    let contentCommentsI = 0;
    if (contentComments)
        contentComments = contentComments.sort((c1, c2) => parseInt(c1.contentSegment, 10) > parseInt(c2.contentSegment, 10));

    fileText.split("\n").forEach((text) => {
        if (text.includes('```')) {
            newFileData += text + '\n';
            openCode = !openCode;
        } else if (text == '') {
            newFileData += '\n';
        } else if (!openCode) {
            let title = (contentComments) ? "'Show comments'" : "'Add your comment'";
            let icon = (contentComments) ? "fa fa-comments" : "fa fa-edit";
            let button = ` <i title=${title} style="cursor: pointer" class="${icon} contentComments" id=${count++}></i>\n`;

            newFileData += text + ((contentComments) ? '' : button);
            if (contentComments && contentCommentsI < contentComments.length && contentComments[contentCommentsI].contentSegment === (count - 1).toString()) {
                newFileData += button + `<ul id=${count - 1} name='contentComments' hidden>`;
                contentComments[contentCommentsI]['comments']
                    .forEach((comment) => {
                        newFileData += `<li>name: ${comment.name}    comment: ${comment.text}</li>`;
                    })
                contentCommentsI++;
                newFileData += "</ul>\n";
            } else {
                newFileData += '\n';
            }
        } else {
            newFileData += text + '\n';
        }
    })

    return newFileData;
}

module.exports = postsRouter
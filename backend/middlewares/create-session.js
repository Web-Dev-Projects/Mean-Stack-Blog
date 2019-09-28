const UidModel = require('../models/uid');

module.exports = (req, res, next) => {
    if (!(req.headers.sid)) {
        UidModel.findOneAndUpdate({}, { $inc: { uid: 1 } }, { useFindAndModify: false, new: false })
            .then((data) => {
                req.headers.sid = data.uid;
                next()
            })
            .catch((err) => {
                console.log("in creating sid", err)
            });
    } else {
        next();
    }
};
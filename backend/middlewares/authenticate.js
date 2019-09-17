const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    try {
        jwt.verify(req.body.accessToken, 'shehab');
        let post = req.body;
        // let username = jwt.decode(req.body.accessToken).username;
        delete post.accessToken;
        req.body = post;
        next()
    } catch (err) {
        console.log("in authentation ", err)
        res.status(401).json({ msg: 'Unauthorized access' });
    }
}
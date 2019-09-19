const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    try {
        jwt.verify(req.headers.accesstoken, 'shehab');
        next()
    } catch (err) {
        console.log("in authentation ", err)
        res.status(401).json({ msg: 'Unauthorized access' });
    }
}
const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    try {
        jwt.verify(req.headers.access_token, 'shehab');
        next()
    } catch (err) {
        console.log("in authentation ", err)
        res.status(401).json({ msg: 'Unauthorized access' });
    }
}
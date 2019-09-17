const formidable = require('formidable');

module.exports = function (req, res, next) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.status(500).json(err);
        } else {
            req.body.files = files;
            req.body.fields = fields;
            req.body.accessToken = fields.accessToken;
            delete req.body.fields.accessToken;
            next();
        }
    });
}


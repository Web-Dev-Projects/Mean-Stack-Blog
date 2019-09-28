const formidable = require('formidable');

module.exports = function (req, res, next) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log("in form parser", err);
            res.status(500).json(err);
        } else {
            reGroupDateFields(fields);

            req.body.files = files;
            req.body.fields = fields;
            next();
        }
    });
}

function reGroupDateFields(fields) {
    fields.date = {
        day: fields.day, monthName: fields.monthName, year: fields.year
    };

    Object.keys(fields.date, (key) => {
        delete fields[key];
    })
}


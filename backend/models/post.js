const mongoose = require('mongoose');

module.exports = mongoose.model('Posts',
    new mongoose.Schema({
        title: String,
        subtitle: String,
        content: String,
        owner: String,
        date: { day: Number, monthName: String, year: Number },
        viewsNum: { type: Number, default: 0 },
        commentsNum: { type: Number, default: 0 },
        reports: {
            type: [{
                reporterName: String,
                reporterMail: String,
                reporterMsg: String,
            }],
            default: []
        },
    }));



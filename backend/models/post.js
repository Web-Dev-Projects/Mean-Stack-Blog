const mongoose = require('mongoose');

module.exports = mongoose.model('Posts',
    new mongoose.Schema({
        title: String,
        subtitle: String,
        contentFileSrc: String,
        contentComments: {
            type: [{
                contentSegment: String,
                comments: [{ name: String, text: String }],
            }],
            default: []
        },
        owner: String,
        date: { day: String, monthName: String, year: String },
        commentsNum: { type: Number, default: 0 },
        postUsers: {
            type: {
                likers: [{ type: String, default: '' }],
                viewers: [{ type: String, default: '' }],
            }, default: { likers: [], viewers: [] }
        },
        reports: {
            type: [{
                reporterName: String,
                reporterMail: String,
                reporterMsg: String,
            }],
            default: []
        },
    }));



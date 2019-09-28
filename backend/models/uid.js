const mongoose = require('mongoose');

module.exports = mongoose.model('Uids',
    new mongoose.Schema({
        uid: Number
    }));
const mongoose = require('mongoose');

exports.connect = (dbName) => {
    mongoose.connect('mongodb://localhost:27017/' + dbName, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('error', () => { throw new Error("Failed to connect to database") });
    mongoose.connection.once('open', function () {
        console.log(`Successfuly connected to ${dbName} DB`);
    });;
}

exports.find = (Model, filter = {}) => {
    return Model.find(filter);
}

exports.findOne = (Model, filter = {}, project = {}) => {
    return Model.findOne(filter, project);
}

exports.create = (Model, data) => {
    return (new Model(data)).save();
}

exports.incFieldsWithValues = (Model, id, fieldsToInc, values) => {
    let incObj = {};
    fieldsToInc.forEach((field, indx) => {
        incObj[field] = values[indx];
    });

    return Model.findOneAndUpdate({ _id: id }, { $inc: incObj },
        { useFindAndModify: false });
}

exports.addElemToList = (Model, id, elem, listName, atBegin = false) => {
    let agg;

    if (atBegin) {
        agg = { $push: { comments: { $each: [elem], $position: 0 } } };
    } else {
        agg = { $push: { comments: elem } };
    }

    return Model.findOneAndUpdate({ _id: id }, agg, { useFindAndModify: false });
}

exports.upsertElemToList = (Model, id, listName, newValue, listFilter) => {
    newValue = Object.assign(newValue, listFilter)
    let obj1 = {}
    let obj2 = {}
    obj1[listName] = listFilter;
    obj2[listName] = newValue;

    let promise1 = Model.findOneAndUpdate({ _id: id }, { $pull: obj1 }, { useFindAndModify: false });
    let promise2 = Model.findOneAndUpdate({ _id: id }, { $push: obj2 }, { useFindAndModify: false });

    return Promise.all([promise1, promise2]);
}


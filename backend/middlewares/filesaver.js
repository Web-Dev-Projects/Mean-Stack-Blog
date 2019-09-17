const path = require('path')
const fs = require('fs')

module.exports = function (req, res, next) {
    let { files, fields } = req.body;

    let uniqueHash = '';
    Object.keys(files).forEach((fileName) => {
        let oldpath = files[fileName].path;
        let oldFileName = path.basename(oldpath);
        uniqueHash = uniqueHash || oldFileName.split('_')[1];
        let newFileNmae = uniqueHash + '_' + files[fileName].name;

        if (files[fileName].type.includes('image')) {
            newFileNmae = "img_" + newFileNmae;
            fields.imgFileSrc = newFileNmae;
        } else {
            fields.exeFileSrc = newFileNmae;
            fields.exeFileSize = files[fileName].size;
        }


        let newpath = path.join(process.env.FILESPATH, newFileNmae);

        fs.rename(oldpath, newpath, function (err) {
            console.log("in filesaver", err);
            if (err)
                return res.status(500).json(err)
        });
    });

    req.body = fields;
    next();
}

const db = require("../models");
const PreApproval = db.preApproval;

const readXlsxFile = require("read-excel-file/node");

const schema = require("../config/excel.schema")
const pagination = require("../utility/pagination");

const upload = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send({
                message: "Please upload an excel file!",
                error: "Please upload an excel file!"
            });
        }

        let path =
            __basedir + "/resources/" + req.file.filename;

        readXlsxFile(path, {schema}).then(({ rows, errors }) => {
            // // skip header
            // rows.shift();
            let preApprovals = [];
            if(errors && errors.length) {
                res.status(500).send({
                    message: "Fail to import data into database!",
                    error: error.message,
                });
            }
            rows.forEach((row) => {
                preApprovals.push(row);
            });

            PreApproval.bulkCreate(preApprovals)
                .then(() => {
                    res.status(200).send({
                        message: "Uploaded the file successfully: " + req.file.originalname,
                    });
                })
                .catch((error) => {
                    res.status(500).send({
                        message: "Fail to import data into database!",
                        error: error.message,
                    });
                });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};

const getPreApprovals = (req, res) => {
    const { page, size } = req.query;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  
    const { limit, offset } = pagination.getPagination(page, size);
    PreApproval.findAndCountAll({limit, offset})
    .then(data => {
      const response = pagination.getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving PreApproval."
      });
    });
};

module.exports = {
    upload,
    getPreApprovals,
};
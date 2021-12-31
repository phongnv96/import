const db = require("../models");
const { Op } = require("sequelize");
const PreApproval = db.preApproval;

const readXlsxFile = require("read-excel-file/node");

const schema = require("../config/excel.schema");
const pagination = require("../utility/pagination");

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send({
        message: "Please upload an excel file!",
        error: "Please upload an excel file!",
      });
    }

    let path = __basedir + "/resources/" + req.file.filename;

    readXlsxFile(path, { schema }).then(({ rows, errors }) => {
      // // skip header
      // rows.shift();
      let preApprovals = [];
      if (errors && errors.length) {
        res.status(500).send({
          message: "Fail to import data into database!",
          error: error.message,
        });
      }
      rows.forEach((row) => {
        preApprovals.push(row);
      });

      PreApproval.bulkCreate(preApprovals)
        .then((data) => {
          res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
            timeStart:
              data && data.length ? data[0]["dataValues"]["updatedAt"] : null,
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
  const { page, size, timeStart, filterBy, sortBy } = req.body;
  const lstHeaders = [];
  for (const key in schema) {
    if (Object.hasOwnProperty.call(schema, key)) {
      const element = schema[key];
      let header = {};
      // header[`${schema[key]["prop"]}`] = key;
      header["key"] = schema[key]["prop"];
      header["display"] = key;
      lstHeaders.push(header);
    }
  }

  const { limit, offset } = pagination.getPagination(page, size);
  let condition = { limit: limit, offset: offset };
  if (timeStart) {
    currentDate = new Date(timeStart);
    condition = {
      ...condition,
      where: {
        updatedAt: {
          [Op.gte]: currentDate,
        },
      },
    };
    if (filterBy) {
      condition.where[filterBy.column] = { [Op.substring]: filterBy.value };
    }
    if (sortBy) {
      condition.order = [`${sortBy.column}`, `${sortBy.value}`]
    }
  } else {
    res.send({ details: [], lstHeaders });
    return;
  }
  PreApproval.findAndCountAll({ ...condition })
    .then((data) => {
      const response = pagination.getPagingData(data, page, limit);
      res.send({ ...response, lstHeaders , filterBy });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving PreApproval.",
      });
    });
};

module.exports = {
  upload,
  getPreApprovals,
};

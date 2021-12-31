const multer = require("multer");

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    // cb("Please upload only excel file.", false);
    return cb(null, false, "Please upload only excel file.");
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, global.__basedir + "/resources/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}-phongnv-${file.originalname}`);
  },
});

var uploadFile = multer({ storage: storage, fileFilter: excelFilter });
module.exports = uploadFile;

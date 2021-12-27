const express = require("express");
const router = express.Router();
const excelController = require("../controllers/excel.controller");
const upload = require("../utility/upload");
const path = require('path');

let routes = (app) => {
  router.post("/api/excel/upload", upload.single("file"), excelController.upload);
  router.get("/api/excel/preApprovals", excelController.getPreApprovals);
  router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/../index.html'));
    //__dirname : It will resolve to your project folder.
  });
  app.use("/", router);
};
module.exports = routes;
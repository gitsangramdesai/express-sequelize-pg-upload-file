var express = require("express");
var router = express.Router();
var db = require("../models");
var upload = require("../uploads");
var fs = require("fs");
var path = require("path");

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    let imageCreated = await db.Images.create({
      mimeType: req.file.mimetype,
      fileName: req.file.filename,
      data: fs.readFileSync(
        path.join("./public/uploads/profile_pic/" + req.file.filename)
      ),
    });
    res.json({
      success: true,
      message: "File Uploaded to Mysql Successfully",
      data: imageCreated,
    });
  } catch (exp) {
    res.json({ success: false, message: exp.message.toString() });
  }
});


router.get("/:fileId", async (req, res) => {
  try {
    var imageFound = await db.Images.findOne({
      where: { imageId: req.params.fileId },
    });
    var buffer = imageFound.data;
    var mimeType = imageFound.mimeType;

    res.contentType(mimeType);
    res.send(buffer);
  } catch (exp) {
    res.json({ success: false, message: exp.message.toString() });
  }
});

module.exports = router;

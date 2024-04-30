Today we will explore how to upload an file (image) into 
mysql database using sequelize.

Lets first create a express application using express generator.

express --view=ejs express-postgres-upload-file

Here is my package.json whivh you can check to install required npm
packages,

{
  "name": "express-mysql-upload-file",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "dotenv": "^16.4.5",
    "ejs": "~2.6.1",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "morgan": "~1.9.1",
    "multer": "^1.4.5-lts.1",
    "pg": "^8.11.5",
    "sequelize": "^6.37.3"
  }
}

Here we are installing multer,dotenv,sequelize,mysql2 packages.

Run npm i.

create .env file in root folder with content

PG_USER=sangram
PG_PASSWORD="sangram#81"
PG_PORT=5432
PG_DATABASE=playground
PG_SERVER=localhost


Now add upload.js in root folder with ollowing content.

var multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/profile_pic/");
  },
  filename: function (req, file, cb) {
    var fileparts = file.originalname.split(".");
    var ext = fileparts[fileparts.length - 1];
    cb(null, file.fieldname + "-" + Date.now() + "." + ext);
  },
});

var upload = multer({ storage: storage });

module.exports = upload;

create models folder in root location & add image.js in it.

module.exports = function (sequelize, DataTypes) {
    const Image = sequelize.define('image', {
        imageId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        mimeType: {
            type: DataTypes.STRING,
        },
        fileName: {
            type: DataTypes.STRING,
            field: 'name'
        },
        data: {
            type: DataTypes.BLOB("long"),
        }
    }, {
        freezeTableName: true
    });
    

    return Image;
}

Now create index.js inside model folder with following content

let { sequelize, Sequelize } = require("../connection.js");

let db = {};
db.Images = require("./image.js")(Sequelize,sequelize);

db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;

Now add uploads folder in public folder & inside uploads folder 
add profile_pic folder.

Now create demo.js inside rotes folder with following content.

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

Inside app.js add 

var demoRouter = require('./routes/demo');

and 

app.use('/demo', demoRouter);

in suitable location.

Now we are ready to run our application.Usually testing can be done using
postman.

For uploading image

curl --location 'http://localhost:3000/demo' \
--form 'image=@"/home/sangram/Pictures/Photo.jpg"'

Output:
{
    "success": true,
    "message": "File Uploaded to Mysql Successfully",
    "data": {
        "imageId": 1,
        "mimeType": "image/jpeg",
        "fileName": "image-1714485923005.jpg",
        "data":{contain binary data},
        "updatedAt": "2024-04-30T13:07:35.512Z",
        "createdAt": "2024-04-30T13:07:35.512Z"
    }
}

Please notice imageId that we are going to use in next api call.

curl --location 'http://localhost:3000/demo/1'

This will output image uploaded in previous step.

The complete code of this application can be found at 

https://github.com/gitsangramdesai/express-sequelize-pg-upload-file
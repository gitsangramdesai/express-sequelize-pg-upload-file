let { sequelize, Sequelize } = require("../connection.js");

let db = {};
db.Images = require("./image.js")(Sequelize,sequelize);

db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;

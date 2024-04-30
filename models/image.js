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
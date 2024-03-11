const { DataTypes } = require('sequelize');
const conn = require('../connect/con')
const {ActivityGHGModel} = require('../models/activityYear');

const ImageFileModel = conn.define('image_file',{
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
      },
      file_name:{
        type: DataTypes.STRING(255),
        allowNull: false
      },
      type_fr:{
        type: DataTypes.STRING(1),
        allowNull: false
      },
      activityperiod_id:{
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
});
    ActivityGHGModel.hasMany(ImageFileModel,{foreignKey:'activityperiod_id'});
    ImageFileModel.belongsTo(ActivityGHGModel,{foreignKey:'activityperiod_id'});



    ImageFileModel.sync(/* {alter:true} */);

    module.exports = {ImageFileModel};


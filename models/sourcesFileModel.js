const { DataTypes } = require('sequelize');
const conn = require('../connect/con')
const {ActivityGHGModel} = require('../models/activityYear');

const SourcesFileModel = conn.define('sources_file',{
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
      },
      file_name:{
        type: DataTypes.STRING(255),
        allowNull: false
      },
      activityperiod_id:{
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
});
    ActivityGHGModel.hasMany(SourcesFileModel,{foreignKey:'activityperiod_id'});
    SourcesFileModel.belongsTo(ActivityGHGModel,{foreignKey:'activityperiod_id'});



    SourcesFileModel.sync({alter:true});

    module.exports = {SourcesFileModel};


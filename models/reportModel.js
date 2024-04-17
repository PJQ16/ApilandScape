const { DataTypes } = require('sequelize');
const conn = require('../connect/con')
 const {ActivityGHGModel} = require('../models/activityYear');

const ReportModel = conn.define('report', {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey:true,
      autoIncrement:true
    },
    activityperiod_id: {
      type: DataTypes.INTEGER(11),
      allowNull:false
    },
    intro:{
      type: DataTypes.TEXT,
      allowNull:false
    },
    tester:{
      type: DataTypes.STRING(255),
      allowNull:false
    },
    coordinator:{
        type: DataTypes.STRING(255),
        allowNull:false
      },
    responsible:{
        type: DataTypes.STRING(255),
        allowNull:false
    },
    monitor:{
        type: DataTypes.STRING(255),
        allowNull:false
    },
    assurance:{
        type: DataTypes.STRING(255),
        allowNull:false
      },
      materially:{
        type: DataTypes.STRING(255),
        allowNull:false
      },
      explanation:{
        type: DataTypes.TEXT,
        allowNull:false
      },
      cfo_operation1:{
        type: DataTypes.TEXT,
        allowNull:false
      },
      cfo_operation2:{
        type: DataTypes.TEXT,
        allowNull:false
      },
      cfo_operation3:{
        type: DataTypes.STRING(255),
        allowNull:false
      },
      image_name:{
        type: DataTypes.STRING(255),
        allowNull:false
      }
  });
 
  ActivityGHGModel.hasMany(ReportModel,{foreignKey:'activityperiod_id'})
  ReportModel.belongsTo(ActivityGHGModel,{foreignKey:'activityperiod_id'});  
 
  ReportModel.sync({alter:true});
  module.exports = {ReportModel}
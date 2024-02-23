const { DataTypes } = require('sequelize');
const conn = require('../connect/con')
const {ActivityGHGModel} = require('../models/activityYear')

const SignificanceModel = conn.define('significance',{
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
      },
    activitity_scope3:{
        type: DataTypes.STRING(255),
        allowNull:false
    },
    percen_ghg:{
        type: DataTypes.INTEGER(3),
        allowNull: false
      },
    magnitude:{
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
    influence:{
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
    opportunity:{
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
    total:{
        type: DataTypes.DECIMAL(3,2),
        allowNull: false
      },
    significance:{
        type: DataTypes.STRING(255),
        allowNull: false
      },
    activityperiod_id:{
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
});
ActivityGHGModel.hasMany(SignificanceModel,{foreignKey:'activityperiod_id'});
SignificanceModel.belongsTo(ActivityGHGModel,{foreignKey:'activityperiod_id'});

SignificanceModel.sync({alter:true});
module.exports = {SignificanceModel};




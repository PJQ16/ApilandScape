const { DataTypes } = require('sequelize');
const conn = require('../connect/con')
const {ActivityGHGModel} = require('../models/activityYear');
const { dataScopeModels } = require('./categoryScope');

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
      datascope_id:{
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
});
dataScopeModels.hasMany(SignificanceModel,{foreignKey:'datascope_id'});
SignificanceModel.belongsTo(dataScopeModels,{foreignKey:'datascope_id'});

SignificanceModel.sync(/* {alter:true} */);
module.exports = {SignificanceModel};




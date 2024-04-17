const { DataTypes } = require('sequelize');
const conn = require('../connect/con')
const {ActivityGHGModel} = require('../models/activityYear');
const {dataScopeModels} = require('../models/categoryScope');

const UncertaintyModel = conn.define('uncertainty',{
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
      },
      score_a:{
        type: DataTypes.INTEGER(2),
        allowNull: false
      },
      score_b:{
        type: DataTypes.INTEGER(2),
        allowNull: false
      },
    datascope_id:{
        type: DataTypes.INTEGER(11),
        allowNull: false
      }
});
     dataScopeModels.hasMany(UncertaintyModel,{foreignKey:'datascope_id'});
    UncertaintyModel.belongsTo(dataScopeModels,{foreignKey:'datascope_id'});  
   
    UncertaintyModel.sync( {alter:true} );

    module.exports = {UncertaintyModel};


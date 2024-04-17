const { DataTypes } = require('sequelize');
const conn = require('../connect/con')
const {PlaceCmuModels, CampusModels} = require('../models/placeAtCmuModels');
 
const ActivityGHGModel = conn.define('activityperiod',{
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
      },
    years:{
        type: DataTypes.INTEGER(4),
        allowNull:false
    },
    employee_amount:{
        type:DataTypes.INTEGER(11),
        defaultValue:0
    },
    building_area:{
        type:DataTypes.DECIMAL(9,2),
        defaultValue:0
    },
    status_base_year:{
      type: DataTypes.BOOLEAN,
      defaultValue:false
    },
    fac_id:{
        type: DataTypes.STRING(255),
        allowNull:false
      },
    campus_id:{
        type: DataTypes.STRING(255),
        allowNull:false
      },
      status_activity:{
        type: DataTypes.CHAR(1),
        defaultValue:0
      }

});

    PlaceCmuModels.hasMany(ActivityGHGModel,{foreignKey:'fac_id'});
    ActivityGHGModel.belongsTo(PlaceCmuModels,{foreignKey:'fac_id'});

    CampusModels.hasMany(ActivityGHGModel,{foreignKey:'campus_id'});
    ActivityGHGModel.belongsTo(CampusModels,{foreignKey:'campus_id'});   
  
    ActivityGHGModel.sync(  {alter:true}  );

    module.exports = {ActivityGHGModel};


const { DataTypes } = require('sequelize');
const conn = require('../connect/con')
const {PlaceCmuModels,CampusModels} = require('../models/placeAtCmuModels');

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
    latitude:{
        type: DataTypes.STRING(255),
        allowNull: false
      },
    longitude:{
        type: DataTypes.STRING(255),
        allowNull: false
      },
    campus_id:{
        type: DataTypes.STRING(255),
        allowNull: false
      },
    fac_id:{
        type: DataTypes.STRING(255),
        allowNull: false
      },
});

    CampusModels.hasMany(ActivityGHGModel,{foreignKey:'campus_id'});
    ActivityGHGModel.belongsTo(CampusModels,{foreignKey:'campus_id'});

    PlaceCmuModels.hasMany(ActivityGHGModel,{foreignKey:'fac_id'});
    ActivityGHGModel.belongsTo(PlaceCmuModels,{foreignKey:'fac_id'});

    ActivityGHGModel.sync({alter:true});

    module.exports = {ActivityGHGModel};


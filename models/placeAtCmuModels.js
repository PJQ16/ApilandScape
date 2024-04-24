const { DataTypes, Model } = require('sequelize');
const conn = require('../connect/con')

const PlaceCmuModels = conn.define('faculty', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey:true,
      autoIncrement:false
    },
    fac_name: {
      type: DataTypes.STRING(255),
      allowNull:false
    },
    campus_id:{
        type:DataTypes.STRING(255),
        allowNull:false
    },
    latitude:{
      type:DataTypes.STRING(255),
      allowNull:true
    },
    longitude:{
      type:DataTypes.STRING(255),
      allowNull:true
    },
    address:{
      type:DataTypes.STRING(255),
      allowNull:true
    },
    logo:{
      type:DataTypes.STRING(255),
      allowNull:true
    },
    status_activity:{
      type:DataTypes.CHAR(1),
      defaultValue:0
    },
  });

  const CampusModels = conn.define('campus', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey:true,
      autoIncrement:false
    },
    campus_name: {
      type: DataTypes.STRING(255),
      allowNull:false
    },
    status_activity:{
      type:DataTypes.CHAR(1),
      defaultValue:0
    },
  });
 
  CampusModels.hasMany(PlaceCmuModels,{foreignKey:'campus_id'});
  PlaceCmuModels.belongsTo(CampusModels,{foreignKey:'campus_id'}); 
   
  CampusModels.sync(  {alter:true} );
  PlaceCmuModels.sync(  {alter:true} );

  module.exports = {CampusModels,PlaceCmuModels}


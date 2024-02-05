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
    }
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
    }
  });

  CampusModels.hasMany(PlaceCmuModels,{foreignKey:'campus_id'});
  PlaceCmuModels.belongsTo(CampusModels,{foreignKey:'campus_id'});

  CampusModels.sync(/* {alter:true} */);
  PlaceCmuModels.sync(/* {alter:true} */);

  module.exports = {CampusModels,PlaceCmuModels}


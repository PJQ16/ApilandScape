const { DataTypes } = require('sequelize');
const conn = require('../connect/con')

const GoogleMapApi = conn.define('map_key',{
    id: {
        type: DataTypes.STRING(255),
        primaryKey:true,
      },
      status_activity:{
        type: DataTypes.CHAR(1),
        defaultValue:0
      },
});


GoogleMapApi.sync( {alter:true} );
module.exports = {GoogleMapApi};


const { DataTypes } = require('sequelize');
const conn = require('../connect/con')
const {dataScopeModels} = require('../models/categoryScope');

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
      datascope_id:{
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
});
    dataScopeModels.belongsTo(SourcesFileModel,{foreignKey:'datascope_id'});
    SourcesFileModel.belongsTo(dataScopeModels,{foreignKey:'datascope_id'});



    SourcesFileModel.sync(/* {alter:true} */);

    module.exports = {SourcesFileModel};


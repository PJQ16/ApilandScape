const { DataTypes } = require('sequelize');
const conn = require('../connect/con')
const {CampusModels,PlaceCmuModels} = require('../models/placeAtCmuModels');
const {ActivityGHGModel} = require('../models/activityYear')
                 

                    const ScopeNumberCateModels = conn.define('catescopenum', {
                      id: {
                        type: DataTypes.INTEGER(11),
                        primaryKey:true,
                        autoIncrement:true
                      },
                      name: {
                        type: DataTypes.STRING(255),
                        allowNull:false
                      },
                    });
                    
                    const GwpModels = conn.define('gwp', {
                      id: {
                        type: DataTypes.INTEGER(11),
                        primaryKey:true,
                        autoIncrement:false
                      },
                      gwp_CO2: {
                      type: DataTypes.INTEGER(5),
                        allowNull:false
                      },
                      gwp_Fossil_CH4:{
                          type: DataTypes.INTEGER(5),
                        allowNull:false
                      },
                      gwp_CH4: {
                          type: DataTypes.INTEGER(5),
                          allowNull:false
                        },
                        gwp_N2O:{
                          type: DataTypes.INTEGER(5),
                          allowNull:false
                        },
                        gwp_SF6: {
                          type: DataTypes.INTEGER(5),
                          allowNull:false
                        },
                        gwp_NF3:{
                          type: DataTypes.INTEGER(5),
                          allowNull:false
                        },
                        gwp_sources:{
                          type: DataTypes.STRING(255),
                          allowNull:false
                        }
                    
                    });

                    const HeadCategoryModels = conn.define('headcategory', {
                      id: {
                        type: DataTypes.INTEGER(11),
                        primaryKey:true,
                        autoIncrement:true
                      },
                      head_name: {
                        type: DataTypes.STRING(255),
                        allowNull:false
                      },
                      scopenum_id:{
                        type: DataTypes.INTEGER(11),
                        allowNull:false
                      }
                    
                    });

                    const categoryScopeModels = conn.define('catescope', {
                      id: {
                        type: DataTypes.INTEGER(11),
                        primaryKey: true,
                        autoIncrement: true
                      },
                      name: {
                        type: DataTypes.STRING(255),
                        allowNull: false
                      },
                      lci: {
                        type: DataTypes.STRING(10),
                        allowNull: false
                      },
                      CO2: {
                        type: DataTypes.DECIMAL(6, 4)
                      },
                      Fossil_CH4: {
                        type: DataTypes.DECIMAL(6, 4)
                      },
                      CH4: {
                        type: DataTypes.DECIMAL(6, 4)
                      },
                      N2O:{
                        type: DataTypes.DECIMAL(6, 4)
                      },
                      SF6: {
                        type: DataTypes.DECIMAL(6, 4)
                      },
                      NF3: {
                        type: DataTypes.DECIMAL(6, 4)
                      },
                      HFCs: {
                        type: DataTypes.DECIMAL(9, 4)
                      },
                      PFCs: {
                        type: DataTypes.DECIMAL(9, 4)
                      },
                      GWP_HFCs: {
                        type: DataTypes.DECIMAL(9, 4)
                      },
                      GWP_PFCs: {
                        type: DataTypes.DECIMAL(9, 4)
                      },
                      kgCO2e: {
                        type: DataTypes.DECIMAL(9, 4)
                      },
                      sources: {
                        type: DataTypes.STRING(255),
                        allowNull:false
                      },
                      head_id: {
                        type: DataTypes.INTEGER(11),
                        allowNull: false
                      }
                    });

                    const dataScopeModels = conn.define('data_scope', {
                      id: {
                        type: DataTypes.INTEGER(11),
                        primaryKey: true,
                        autoIncrement: true
                      },
                      name: {
                        type: DataTypes.STRING(255),
                        allowNull: false
                      },
                      quantity:{
                        type: DataTypes.DECIMAL(10,2),
                        defaultValue:0
                      },
                      lci: {
                        type: DataTypes.STRING(10),
                        allowNull: false
                      },
                      CO2: {
                        type: DataTypes.DECIMAL(6, 4)
                      },
                      Fossil_CH4: {
                        type: DataTypes.DECIMAL(6, 4)
                      },
                      CH4: {
                        type: DataTypes.DECIMAL(6, 4)
                      },
                      N2O:{
                        type: DataTypes.DECIMAL(6, 4)
                      },
                      SF6: {
                        type: DataTypes.DECIMAL(6, 4)
                      },
                      NF3: {
                        type: DataTypes.DECIMAL(6, 4)
                      },
                      HFCs: {
                        type: DataTypes.DECIMAL(9, 4)
                      },
                      PFCs: {
                        type: DataTypes.DECIMAL(9, 4)
                      },
                      GWP_HFCs: {
                        type: DataTypes.DECIMAL(9, 4)
                      },
                      GWP_PFCs: {
                        type: DataTypes.DECIMAL(9, 4)
                      },
                      kgCO2e: {
                        type: DataTypes.DECIMAL(9, 4)
                      },
                      sources: {
                        type: DataTypes.STRING(255),
                        allowNull:false
                      },
                      GWP_id: {
                        type: DataTypes.INTEGER(11), 
                        allowNull: false
                      },
                      head_id: {
                        type: DataTypes.INTEGER(11),
                        allowNull: false
                      },
                      fac_id:{
                        type: DataTypes.STRING(255),
                        allowNull: false
                      },
                      campus_id:{
                        type: DataTypes.STRING(255),
                        allowNull: false
                      },
                      activityperiod_id:{
                        type: DataTypes.INTEGER(11),
                        allowNull: false
                      }
                    });
 

  ScopeNumberCateModels.hasMany(HeadCategoryModels, { foreignKey: 'scopenum_id' });
  HeadCategoryModels.belongsTo(ScopeNumberCateModels, { foreignKey: 'scopenum_id' });
  
  HeadCategoryModels.hasMany(categoryScopeModels, { foreignKey: 'head_id' });
  categoryScopeModels.belongsTo(HeadCategoryModels, { foreignKey: 'head_id' });
  

  GwpModels.hasMany(dataScopeModels,{foreignKey:'GWP_id'});
  dataScopeModels.belongsTo(GwpModels,{foreignKey:'GWP_id'});

  ActivityGHGModel.hasMany(dataScopeModels,{foreignKey:'activityperiod_id'});
  dataScopeModels.belongsTo(ActivityGHGModel,{foreignKey:'activityperiod_id'});

  CampusModels.hasMany(dataScopeModels,{foreignKey:'campus_id'});
  dataScopeModels.belongsTo(CampusModels,{foreignKey:'campus_id'});

  PlaceCmuModels.hasMany(dataScopeModels,{foreignKey:'fac_id'});
  dataScopeModels.belongsTo(PlaceCmuModels,{foreignKey:'fac_id'});         
  
  HeadCategoryModels.hasMany(dataScopeModels,{foreignKey:'head_id'});
  dataScopeModels.belongsTo(HeadCategoryModels,{foreignKey:'head_id'});         

  //test  at relationship of model

//เปิดเมื่อยังไม่มีตารางสร้างตาราง
ScopeNumberCateModels.sync( {alter:true} );
HeadCategoryModels.sync(  { alter: true }  );
GwpModels.sync(  { alter: true }  ); 
categoryScopeModels.sync( { alter: true }  );  
dataScopeModels.sync(   {alter:true}   );

module.exports = {HeadCategoryModels, GwpModels, categoryScopeModels,dataScopeModels,ScopeNumberCateModels };
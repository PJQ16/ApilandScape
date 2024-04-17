const swaggerJSDoc =require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'API for CFO',
      version: '1.0.0',
    },
    servers: [
        {
          url: 'http://localhost:3084',
          description: 'Server api',
        },
      ],
  };
  
  const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./controller/*.js'],
  };
  
  const swaggerSpec = swaggerJSDoc(options);
  
  module.exports = {swaggerSpec,swaggerUi }
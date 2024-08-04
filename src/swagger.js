import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Todo App',
    version: '1.0.0',
    description: 'API documentation for the Todo application',
  },
  servers: [
    {
      url: 'https://todo-g55k.onrender.com/api/v1/task',
      description: 'Local development server',
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ['C:/Users/Biranjay/OneDrive/Desktop/Nexorand/backend/src/routes/*.js'], 
};

console.log(options);
const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

import { properties } from './properties';
import router from './router';

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Mi API",
        version: "1.0.0",
        description: "Documentación para mi API",
      },
      servers: [{ url: "http://localhost:8080" }],
    },
    apis: ["./src/**/*.ts"], // Archivos con comentarios Swagger
  };
  
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(
    cors(
        {
            origin: '*',
            credentials: true,
        }
));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server running on  http://localhost:8080')
})

mongoose.Promise = Promise;
mongoose.connect(properties.mongo_url);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
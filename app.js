import express from 'express';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from "swagger-ui-express"
import postRouter from './routes/auth';
import getRouter from './routes/getroutes';
import updateRouter from './routes/updateroutes';
import deleteRouter from './routes/deleteroutes';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Akera logistics API Documentation",
      version: "1.0",
      description:
        "This is Akera logistics API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "https://akera-backend.herokuapp.com/api/v1",
      },
    ],
    components:{
      securitySchemes:{
        bearerAuth:{
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    } 
  },
  apis: ["./routes/*.js"],
};

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)))

// app.use(express.static('public'));
app.set('view engine', 'ejs');

// The middleware for the home page
app.get('/', (req, res) => {
  res.send(
  <div id="mapcontainer" style="width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;">
      <h2>Welcom to Akera logistics API</h2>
      <a href="https://akera-backend.herokuapp.com/api/v1/api-docs">
        API Documentation
      </a>
  </div>
  );
});

// The middleware that uses the router module
app.use('/api/v1', getRouter);
app.use('/api/v1', postRouter);
app.use('/api/v1', updateRouter);
app.use('/api/v1', deleteRouter);

// The middleware for a bad url request
app.use((req, res) => {
  res.status(404).send('page not found');
});

app.use((err, req, res, next) => {
  res.status(400).json(err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);

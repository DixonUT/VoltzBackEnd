require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { PORT = 8080 } = process.env;

const apiRouter = require('./api');
const client = require('./db/client');

const server = express();

// Middleware
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Serve static pictures
server.use("/pictures", express.static("pictures"));

// API Routes
server.use('/api', apiRouter);

// 404 Route
server.get('*', (req, res) => {
  res.status(404).send({ error: '404 - Not Found', message: 'No route found for the requested URL' });
});

// Error Handling Middleware
server.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  res.status(error.statusCode || 500).json({ error: error.message || 'Internal Server Error' });
});

// Start server
client.connect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server Started on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

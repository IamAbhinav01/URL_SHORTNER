const express = require('express');
const { serverConfig, loggerConfig } = require('./config');
const apiRoutes = require('./routes');
const { redirectUrl } = require('./controller/urlController');
const { errorMiddleware } = require('./middlewares');
const { sequelize } = require('./models');

const app = express();

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api', apiRoutes);

// Root redirect route for short codes (e.g. GET /abc123)
app.get('/:shortCode', redirectUrl);

// Global Error Handler Middleware
app.use(errorMiddleware);

const PORT = serverConfig.PORT || 3000;

app.listen(PORT, async () => {
  loggerConfig.info(`Server listening on port ${PORT}`);
  try {
    await sequelize.authenticate();
    loggerConfig.info('Database connection established successfully.');
  } catch (error) {
    loggerConfig.error(`Unable to connect to the database: ${error.message}`);
  }
});

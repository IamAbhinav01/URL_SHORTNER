const express = require('express');
const shortnerRoutes = require('./shortner');
const router = express.Router();

router.use('/shortner', shortnerRoutes);

module.exports = router;

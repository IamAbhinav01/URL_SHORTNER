const express = require('express');
const router = express.Router();
const { createRestApi, getAnalytics } = require('../../controller/urlController');
const { validateShortenUrl } = require('../../middlewares');

router.post('/', validateShortenUrl, createRestApi);
router.get('/analytics/:shortCode', getAnalytics);

module.exports = router;

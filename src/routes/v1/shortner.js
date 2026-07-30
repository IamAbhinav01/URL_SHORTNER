const express = require('express');
const router = express.Router();
const { createRestApi } = require('../../controller/urlController');

router.post('/', createRestApi);

module.exports = router;

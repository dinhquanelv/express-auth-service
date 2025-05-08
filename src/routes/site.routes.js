const express = require('express');
const router = express.Router();
const siteController = require('../controllers/site.controller');

router.get('/', siteController.index);
router.get('/example', siteController.example);

module.exports = router;

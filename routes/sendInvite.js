var express = require('express');
var router = express.Router();
const email = require('../src/email.js');

router.post('/', async function (req, res) {
    let result = email.sendMail(req.body);

    return res.status(201).json({ result });
});

module.exports = router;

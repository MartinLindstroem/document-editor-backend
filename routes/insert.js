var express = require('express');
var router = express.Router();
const database = require("../db/database");

router.post('/', async function (req, res) {
    const data = await database.insertDocument(req.body.name, req.body.content);

    return res.status(201).json({ data });
});

module.exports = router;

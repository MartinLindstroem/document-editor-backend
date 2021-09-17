var express = require('express');
var router = express.Router();
const database = require("../db/database");
// const objectId = require('mongodb').ObjectId;

router.put('/', async function (req, res) {
    const data = await database.updateDocument(req.body._id, req.body.name, req.body.content);

    return res.status(200).json({ data });
});

module.exports = router;

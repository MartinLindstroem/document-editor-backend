var express = require('express');
var router = express.Router();
const database = require("../db/database");

router.get('/', async function (req, res,) {
    try {
        let result = await database.getAllDocuments();

        res.json(result);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;

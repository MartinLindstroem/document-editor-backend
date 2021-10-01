var express = require('express');
var router = express.Router();
const database = require("../db/database");

router.get('/:user', async function (req, res) {
    try {
        let result = await database.getAllDocumentsByUser("docs", req.params.user);

        res.json(result);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;

var express = require('express');
var router = express.Router();
const database = require("../db/database");
const auth = require("../src/auth");

// router.post('/', async function (req, res) {
//     const data = await database.insertDocument("docs", req.body.name, req.body.content);

//     return res.status(201).json({ data });
// });
router.post("/",
    // (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => database.insertDocument(res, "docs", req.body));

module.exports = router;

var express = require('express');
var router = express.Router();
const database = require("../db/database");
const auth = require("../src/auth");
// const objectId = require('mongodb').ObjectId;

router.put('/',
    // (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => database.updateDocument(res, "docs", req.body));
// const data = await database.updateDocument
//("docs", req.body._id, req.body.name, req.body.content);

// return res.status(200).json({ data });

module.exports = router;

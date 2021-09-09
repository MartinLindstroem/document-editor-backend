var express = require('express');
var router = express.Router();
const database = require("../db/database");

router.get('/', async function (req, res, next) {
    try {
        let result = await getAllDocuments();
        console.log(result);
        res.json(result);
    } catch (err) {
        console.log(err);
    }
});

async function getAllDocuments() {
    const db = await database.getDb();
    const col = db.collection;
    const res = await col.find().toArray();

    await db.client.close();

    return res;
}

module.exports = router;
var express = require('express');
var router = express.Router();
const database = require("../db/database");

router.post('/', async function (req, res, next) {
    const doc = {
        name: req.body.name,
        content: req.body.content,
    }

    const db = await database.getDb();
    const result = await db.collection.insertOne(doc);

    await db.client.close();

    if (result.acknowledged) {
        itemId = result.insertedId;
        console.log(itemId);
        return res.status(201).json({ data: { _id: result.insertedId, name: doc.name, content: doc.content } });
    }
});

module.exports = router;
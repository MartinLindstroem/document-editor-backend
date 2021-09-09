var express = require('express');
var router = express.Router();
const database = require("../db/database");
const objectId = require('mongodb').ObjectId;

router.put('/', async function (req, res, next) {
    const filter = { _id: objectId(req.body._id) };
    const updateDoc = {
        name: req.body.name,
        content: req.body.content,
    }

    const db = await database.getDb();
    const result = await db.collection.updateOne(filter, { $set: updateDoc });

    await db.client.close();

    console.log(result);
    if (result.acknowledged) {
        return res.status(200).json({ data: { _id: result.upsertedId, name: updateDoc.name, content: updateDoc.content } });
    }
});

module.exports = router;
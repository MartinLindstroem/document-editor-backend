var express = require('express');
var router = express.Router();
const database = require("../db/database");

router.get('/', async function (req, res) {
    const data = {
        criteria: req.body.criteria,
        projection: req.body.projection,
        limit: req.body.limit,
    };

    try {
        let result = await findInCollection(
            data.criteria, data.projection, data.limit
        );

        console.log(result);
        res.json(result);
    } catch (err) {
        console.log(err);
    }
});

async function findInCollection(criteria, projection, limit) {
    const db = await database.getDb();
    const col = db.collection;
    const res = await col.find(criteria, { projection: projection }).limit(limit).toArray();

    await db.client.close();

    return res;
}

module.exports = router;

const mongo = require("mongodb").MongoClient;
const collectionName = "docs";
const objectId = require('mongodb').ObjectId;

const database = {
    getDb: async function getDb() {
        let dsn = "mongodb://localhost:27017/test";

        if (process.env.NODE_ENV !== 'test') {
            const config = require("./config.json");

            dsn = `mongodb+srv://${config.username}:${config.password}
            @cluster0.2kqjd.mongodb.net/jsramverk?retryWrites=true&w=majority`;
        }

        const client = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    },
    insertDocument: async function insertDoc(name, content) {
        const data = {
            name: name,
            content: content,
        };

        const db = await this.getDb();

        const result = await db.collection.insertOne(data);

        await db.client.close();

        if (result.acknowledged) {
            // itemId = result.insertedId;
            return {
                _id: result.insertedId,
                name: data.name,
                content: data.content
            };
        }
    },

    updateDocument: async function updateDoc(id, name, content) {
        const filter = { _id: objectId(id) };
        const data = {
            name: name,
            content: content,
        };

        const db = await this.getDb();
        const result = await db.collection.updateOne(filter, { $set: data });

        await db.client.close();

        if (result.acknowledged) {
            return {
                _id: result.upsertedId,
                name: data.name,
                content: data.content
            };
        }
    },

    getAllDocuments: async function getAllDocs() {
        const db = await this.getDb();
        const col = db.collection;
        const res = await col.find().toArray();

        await db.client.close();

        return res;
    }
};

module.exports = database;

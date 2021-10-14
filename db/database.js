const mongo = require("mongodb").MongoClient;
// const collectionName = "docs";
const objectId = require('mongodb').ObjectId;

const database = {
    getDb: async function getDb(collectionName) {
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
    insertDocument: async function insertDoc(res, collection, body) {
        const data = {
            name: body.name,
            content: body.content,
            created_by: body.created_by,
            auth_users: body.auth_users
        };

        const db = await this.getDb(collection);

        const result = await db.collection.insertOne(data);

        await db.client.close();

        if (result.acknowledged) {
            return res.status(201).json({ msg: "Document saved" });
        }
    },

    updateDocument: async function updateDoc(res, collection, body) {
        const filter = { _id: objectId(body._id) };
        const data = {
            name: body.name,
            content: body.content,
            // created_by: body.created_by,
            auth_users: body.auth_users
        };

        const db = await this.getDb(collection);
        const result = await db.collection.updateOne(filter, { $set: data });

        await db.client.close();

        if (result.acknowledged) {
            return res.status(201).json({ msg: "Document updated" });
        }
    },

    getAllDocuments: async function getAllDocs(collection) {
        const db = await this.getDb(collection);
        const col = db.collection;
        const res = await col.find().toArray();

        await db.client.close();

        return res;
    },

    getAllDocumentsByUser: async function getAllDocs(collection, email) {
        const db = await this.getDb(collection);
        const col = db.collection;
        const res = await col.find({
            $or: [{ "created_by": email }, { "auth_users": email }]
        }).toArray();

        await db.client.close();

        return res;
    },
};

module.exports = database;

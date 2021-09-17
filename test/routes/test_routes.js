process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../app.js");

const database = require("../../db/database.js");
const collectionName = "docs";

chai.should();
chai.use(chaiHttp);

let doc = {
    name: "New Document",
    content: "This is a new document"
};

let updatedDoc = {
    name: "Updated Document",
    content: "This is an updated document"
};

let searchCriteria = {
    criteria: {
        name: "Updated Document"
    },
    projection: {
        _id: 1,
        name: 1,
        content: 1
    },
    limit: 2
};

describe("documents", () => {
    before(() => {
        return new Promise(async (resolve) => {
            const db = await database.getDb();

            db.db.listCollections(
                { name: collectionName }
            )
                .next()
                .then(async function (info) {
                    if (info) {
                        await db.collection.drop();
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
                .finally(async function () {
                    await db.client.close();
                    resolve();
                });
        });
    });

    describe("GET /", () => {
        it("200 PATH", (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.include({ msg: "Hello World" });
                    done();
                });
        });
    });

    describe("POST /insert", () => {
        it("201 PATH", (done) => {
            chai.request(server)
                .post("/insert")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.should.include({ name: doc.name, content: doc.content });
                    updatedDoc._id = res.body.data._id;
                    done();
                });
        });
    });

    describe("GET /getAll", () => {
        it("200 PATH", (done) => {
            chai.request(server)
                .get("/getAll")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("array");
                    res.body[0].should.be.an("object");
                    res.body[0].should.include({ name: doc.name });
                    res.body[0].should.include({ content: doc.content });
                    done();
                });
        });
    });

    describe("PUT /update", () => {
        it("200 PATH", (done) => {
            chai.request(server)
                .put("/update")
                .send(updatedDoc)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.include(
                        { name: updatedDoc.name, content: updatedDoc.content }
                    );
                    done();
                });
        });
    });

    describe("GET /getAll after update", () => {
        it("200 PATH", (done) => {
            chai.request(server)
                .get("/getAll")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("array");
                    res.body[0].should.be.an("object");
                    res.body[0].should.include({ name: updatedDoc.name });
                    res.body[0].should.include({ content: updatedDoc.content });
                    done();
                });
        });
    });

    describe("GET /search", () => {
        it("200 PATH", (done) => {
            chai.request(server)
                .get("/search")
                .send(searchCriteria)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("array");
                    res.body[0].should.be.an("object");
                    res.body[0].should.include({ name: updatedDoc.name });
                    res.body[0].should.include({ content: updatedDoc.content });
                    done();
                });
        });
    });
});

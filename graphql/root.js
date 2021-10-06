const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    // GraphQLInt,
    // GraphQLNonNull
} = require('graphql');

const DocumentType = require("./document.js");
const database = require("../db/database.js");

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        documents: {
            type: GraphQLList(DocumentType),
            description: "List of all documents",
            resolve: async function () {
                return await database.getAllDocuments("docs");
            }
        },
        userDocuments: {
            type: GraphQLList(DocumentType),
            description: "List of all documents user can access",
            args: {
                username: { type: GraphQLString }
            },
            resolve: async function (parent, args) {
                let documentsArray = await database.getAllDocumentsByUser("docs", args.username);

                return documentsArray;
            }
        }
    })
});

module.exports = RootQueryType;

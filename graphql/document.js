const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    // GraphQLInt,
    // GraphQLNonNull
} = require('graphql');

const DocumentType = new GraphQLObjectType({
    name: "Document",
    description: "This represents a document",
    fields: () => ({
        _id: { type: GraphQLString },
        name: { type: GraphQLString },
        content: { type: GraphQLString },
        created_by: { type: GraphQLString },
        auth_users: {
            type: GraphQLList(GraphQLString)
        }
    })
});

module.exports = DocumentType;

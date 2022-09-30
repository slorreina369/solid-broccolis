const { gql } = require('apollo-server-express');

const typeDefs = gql`
    input SavedBooks{
        authors:[String]
        description:String
        bookId:String
        image:String
        link:String
        title:String
    }
    type Query {
        me: User
        users:[User]
        savedBooks:[Book]
    }

    type User {
        _id:ID!
        username: String
        email: String
        password: String
        bookCount: Int
        savedBooks:[Book]
    }

    type Book {
        bookId:String
        authors:[String]
        description:String
        title:String
        image:String
        link:String
    }

    type Auth{
        token: ID!
        user:User
    }

    type Mutation{
        login(email:String!, password:String!):Auth
        addUser(username:String!, email:String!, password:String!):Auth
        savedBook(bookData:SavedBooks):User
        removeBook(bookId:String!):User
    }
`;

module.exports = typeDefs;
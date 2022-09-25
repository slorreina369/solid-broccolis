const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        me: User
        users:[User]
        user(username:String!):User
        books(title:String!):[Book]
        book(bookId:String!):Book
    }

    type User {
        _id:ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks:[Book]
    }

    type Book {
        bookId:String!
        authors:[String]
        description:String!
        title:String!
        image:String
        link:String
    }

    type Auth{
        user:[User]
    }

    type Mutation{
        login(email:String!, password:String!):User
        addUser(username:String!, email:String!, password:String!):User
    }
`;

module.exports = typeDefs;


// saveBook(authors:String, description:String!, title:String!, bookId:String!, image:String, link:String):User
// removeBook(bookId:String!):User
const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/Author');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} = graphql;

/*
{
book(id: '123')
name
genre
{
author
}
}
*/

const BookType = new GraphQLObjectType({
  name: "BookType",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId);
      }
    }
  })
});

/*
{
author(id: '123')
name
age
{
book {
name
genre
}
}
}
*/

const AuthorType = new GraphQLObjectType({
  name: "AuthorType",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ authorId: parent.id });
      }
    }
  })
});

/*
{
book(id: '123')
name
genre
}
*/

const rootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args){
        console.log('RootQueryType > book');
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args){
        console.log('RootQueryType > author');
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        console.log('RootQueryType > books');
        return Book.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        console.log('RootQueryType > authors');
        return Author.find({});
      }
    },
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args){
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args){
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: rootQuery,
  mutation: Mutation
})

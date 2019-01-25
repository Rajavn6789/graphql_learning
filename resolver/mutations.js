const graphql = require('graphql');
const { GraphQLError } = graphql;
const Book = require('../models/Book');
const Author = require('../models/Author');

module.exports = {
  addAuthor: async function(parent, args) {
    const author = await Author.findOne({ name: args.name });
    let queryResult = null;
    if(author) {
      throw new GraphQLError('User already exist');
    } else {
      let author = new Author({
        name: args.name,
        age: args.age
      });
      queryResult = author.save();
    }
    return queryResult
  },
  addBook: async function(parent, args) {
    const book = await Book.findOne({ name: args.name });
    let queryResult = null;
    if(book) {
      throw new GraphQLError('Book already added');
    } else {
      let book = new Book({
        name: args.name,
        genre: args.genre,
        authorId: args.authorId,
      });
      queryResult = book.save();
    }
    return queryResult
  },
};

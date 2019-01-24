const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} = graphql;


const booksData = [
  {id: '1', name: 'Name of the Wind', genre: 'Fantasy', authorId: '44'},
  {id: '2', name: 'The Final Empire', genre: 'Fantasy', authorId: '55'},
  {id: '3', name: 'The Long Earth', genre: 'Sci-Fi', authorId: '66'},
];

const authorsData = [
  {id: '44', name: 'Patrick RothFuss', age: 44},
  {id: '55', name: 'Brandon Sanderson', age: 42},
  {id: '66', name: 'Terry Pratchett', age: 66},
];

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

const bookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: authorType,
      resolve(parent, args) {
        console.log('parent', parent);
        return authorsData.find(obj => obj.id === parent.authorId);
      }
    }
  })
});

const authorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
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
      type: bookType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args){
        return booksData.find(obj => obj.id === args.id);
      }
    },
    author: {
      type: authorType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args){
        return authorsData.find(obj => obj.id === args.id);
      }
    },

  }
});

module.exports = new GraphQLSchema({
  query: rootQuery
})

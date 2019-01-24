const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
} = graphql;


const booksData = [
  { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
  { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
  { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
  { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
  { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
  { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' }
];

const authorsData = [
  { name: 'Patrick Rothfuss', age: 44, id: '1' },
  { name: 'Brandon Sanderson', age: 42, id: '2' },
  { name: 'Terry Pratchett', age: 66, id: '3' }
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

const authorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(bookType),
      resolve(parent, args) {
        return booksData.filter(obj => obj.authorId === parent.id);
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
      type: bookType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args){
        console.log('RootQueryType > book');
        return booksData.find(obj => obj.id === args.id);
      }
    },
    author: {
      type: authorType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args){
        console.log('RootQueryType > author');
        return authorsData.find(obj => obj.id === args.id);
      }
    },
    books: {
      type: new GraphQLList(bookType),
      resolve(parent, args){
        console.log('RootQueryType > books');
        return booksData;
      }
    },
    authors: {
      type: new GraphQLList(authorType),
      resolve(parent, args){
        console.log('RootQueryType > authors');
        return authorsData;
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: rootQuery
})

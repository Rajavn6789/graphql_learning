const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

// set up express
const app = express();

// connect to mlab database
mongoose.connect('mongodb://graphql_admin:hI9W56735E@ds111455.mlab.com:11455/graphql_learning_db')
mongoose.connection.once('open', () => {
    console.log('Conneted to database');
});

// bind express with graphql
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(4000, () => {
  console.log('Listening to port 4000!');
});

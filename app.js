var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { expressMiddleware } = require('@apollo/server/express4');
const connectDB = require('./database/database');
require('dotenv').config();
const connectGraphQL = require('./graphQL/graphQL');
var indexRouter = require('./routes/index');

let mongoURI = process.env.MONGO_URI;
connectDB(mongoURI);

var app = express();

app.use(cors())

async function startServer() {
  const graphQLServer = await connectGraphQL();
  await graphQLServer.start();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', indexRouter);
  app.use('/graphql', expressMiddleware(graphQLServer, {
    context: async ({ req }) => {
      let token = req.headers.authorization;
      return { token };
    }
  }));

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
}
// Start the server
startServer().catch(err => {
  console.error('Failed to start server:', err);
});


module.exports = app;

/* jshint esversion: 6 */
const express = require('express');
const sessions = require('express-session');
const mongo = require('mongoose');
const MongoStore = require('connect-mongo')(sessions);
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./bin/mongodb').MONGO_MAIN;
const reload = require('reload');

// Linking to routers
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const aboutRouter = require('./routes/about');
const projectsRouter = require('./routes/projects');
const rentRouter = require('./routes/rent');
const registerRouter = require('./routes/register');
const logoutRouter = require('./routes/logout');

//mongo connect
mongo.connect(db, { useNewUrlParser: true })
.then(() => { console.log('MongoDB connected.'); })
.catch(err => { console.log(`MongoDB connection error: \n${err}`);
});

//init session framework
app.use(sessions({
  key: 'user_sid',
  secret: 'neutron22',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongo.connection,
    collection: 'session'
  })
}));

// Set html framework
app.set('view engine', 'ejs');

// setup static folder directory and model language
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

//Spin up the routes
app.use('/login', loginRouter);
app.use('/about', aboutRouter);
app.use('/projects', projectsRouter);
app.use('/rent', rentRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use('/', indexRouter);

reload(app);

module.exports = app;

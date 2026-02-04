const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

// Controller
const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js');
const usersController = require('./controllers/users');
const recipesController = require('./controllers/recipes.js');
const ingredientsController = require('./controllers/ingredients.js');

// Middleware
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Core middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Custom middleware
app.use(passUserToView);

// Controllers
app.use('/auth', authController);

// public routes (No need to log-in)
app.use('/users', usersController);

// protected routes (Need to log-in)
app.use('/users/:userId/foods', isSignedIn, foodsController);
app.use('/recipes', recipesController);
app.use('/ingredients', isSignedIn, ingredientsController);

// View engine
app.set("view engine", "ejs");

app.get('/', (req, res) => {
  res.render('index', {
    user: req.session.user,
  });

  // // Test
  // res.send('Welcome to CookBook App')

  // res.render('index');

});

// app.get('/vip-lounge', (req, res) => {
//   if (req.session.user) {
//     res.send(`Welcome to the party ${req.session.user.username}.`);
//   } else {
//     res.send('Sorry, no guests allowed.');
//   }
// });

// app.use('/auth', authController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

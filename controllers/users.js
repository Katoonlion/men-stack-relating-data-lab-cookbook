// controllers/users.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');

// COMMUNITY: GET /users --> List all users
router.get('/', async(req, res) => {
    try {
        const users = await User.find({}, {username: 1}); // username+_id

        res.locals.users = users;
        res.render('users/index')       
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// SHOW: GET /users/:userId --> See other user's pantry
router.get('/:userId', async(req, res) => {
    try {
        const profileUser = await User.findById(req.params.userId, { username: 1 });
        const recipes = await Recipe.find({ owner: req.params.userId });

        res.locals.profileUser = profileUser;
        // res.locals.pantry = user.pantry;
        res.locals.recipes = recipes;
        res.render('users/show');
    } catch (error) {
        console.log(error);
        res.redirect('/users');
    }
});

module.exports = router;
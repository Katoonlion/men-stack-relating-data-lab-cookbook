// controllers/users.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// COMMUNITY: GET /users --> List all users
router.get('/', async(req, res) => {
    try {
        const users = await User.find({}, {username: 1}); // username+_id

        res.locals.users = users;
        res.render('users/community')       
    } catch (error) {
        console.log(error);
        res.redirect(error);
    }
});

// SHOW: GET /users/:userId --> See other user's pantry
router.get('/:userId', async(req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        res.locals.profileUser = user;
        res.locals.pantry = user.pantry;
        res.render('users/show');
    } catch (error) {
        console.log(error);
        res.redirect(error);
    }
});

module.exports = router;
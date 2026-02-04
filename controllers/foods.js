// controllers/foods.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// router logic will go here - will be built later on in the lab

// Index: GET /users/:userId/foods
// router.get('/', (req, res) => {
//   res.render('foods/index.ejs');
// });

router.get('/', async(req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    
    //Send all pantry items to the view via res.locals
    res.locals.pantry = user.pantry;
    res.locals.userId = user._id;

    res.render('foods/index');  
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});
 
// New: GET /users/:userId/foods/new --> show form add new page
router.get('/new', async(req, res) => {
    try {
        const user = await User.findById(req.session.user._id);

        res.locals.pantry = user.pantry;
        res.locals.userId = user._id;
        res.render('foods/new');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Ceate: POST /users/:userId/foods  --> create new food in pantry

router.post('/', async(req, res) => {
    try {
        // Current user from session
        const user = await User.findById(req.session.user._id);

        // Push form data into embedded pantry array
        user.pantry.push(req.body);

        // Save user
        // await dbUser.save();
        await user.save();

        // Redirect back      
        res.redirect(`/users/${user._id}/foods`);

    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Delete: DELETE to /users/:userId/foods/:itemId --> Remove food from list 
router.delete('/:itemId', async(req, res) => {
    try {
        const user = await User.findById(req.session.user._id);

        //Delete embedded doc by Id
        user.pantry.id(req.params.itemId)?.deleteOne();

        await user.save();
        res.redirect(`/users/${user._id}/foods`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }

});
// Edit: GET /users/:userId/foods/:itemId/edit --> form edit page
router.get('/:itemId/edit', async(req, res) => {
    try {
        const user = await User.findById(req.session.user._id);

        const food = user.pantry.id(req.params.itemId);

        // send current food via res.locals 
        res.locals.userId = user._id;
        res.locals.food = food;
        res.render('foods/edit');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }

});

// Update: Update data in databases
router.put('/:itemId', async(req, res) => {
    try {
        const user = await User.findById(req.session.user._id);

         const food = user.pantry.id(req.params.itemId);

        // Update embedded doc 
        food.set(req.body);

        await user.save();
        res.redirect(`/users/${user._id}/foods`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});


module.exports = router;

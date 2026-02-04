// controllers/recipes.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
// const { route } = require('./recipes.js');
const Ingredient = require('../models/ingredient');
const isSignedIn = require('../middleware/is-signed-in');
const isRecipeOwner = require('../middleware/is-recipe-owner');

// router.get('/', (req, res) => {
//     //res.send('Recipes index works!');
//     res.render('recipes/index');
// });

// Index: GET /recipes --> View all recipes
router.get('/', async(req, res) => {
    try {
        const recipes = await Recipe.find({owner: req.session.user._id});

        res.locals.recipes = recipes;
        res.render('recipes/index');        
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// New: GET /recipes/new --> show form for adding new recipes
// router.get('/new', (req, res) => {
//     res.render('recipes/new');
// });

router.get('/new', async (req, res) => {
    try {
        const ingredients = await Ingredient.find().sort('name');

        res.render('recipes/new', { ingredients });
    } catch (err) {
        console.log(err);
        res.redirect('/recipes');
    }
});

// Ceate: POST /recipes --> create new create recipe
router.post('/', async (req, res) => {
  try {
    // checkbox --> array
    let ingredientIds = req.body.ingredientIds || [];
    if (!Array.isArray(ingredientIds)) ingredientIds = [ingredientIds];

    // Create recipe
    const newRecipe = new Recipe(req.body);
    newRecipe.ingredients = ingredientIds;

    // Set owner
    newRecipe.owner = req.session.user._id;


    // Save recipe
    await newRecipe.save();

    // Add recipe ref. to user.recipes (one-to-many)
    const user = await User.findById(req.session.user._id);
    user.recipes.push(newRecipe._id);
    await user.save();

    res.redirect(`/recipes/${newRecipe._id}`);
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});


// SHOW: GET /recipes/:recipeId --> show the full details of each recipe user create
router.get('/:recipeId', async(req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId).populate('ingredients');;

        res.locals.recipe = recipe;
        res.render('recipes/show');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// DELETE: DELETE /recipes/:recipeId
router.delete('/:recipeId', isSignedIn, isRecipeOwner, async(req, res) => {
    try {
        await Recipe.deleteOne({_id: req.params.recipeId});
        res.redirect('/recipes');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// EDIT: GET /recipes/:recipeId/edit 
router.get('/:recipeId/edit', isSignedIn, isRecipeOwner, async(req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);

        res.locals.recipe = recipe;
        res.render('recipes/edit');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// UPDATE: PUT /recipes/:recipeId
router.put('/:recipeId', isSignedIn, isRecipeOwner, async(req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);

        recipe.name = req.body.name;
        
        await recipe.save();
        res.redirect(`/recipes/${recipe._id}`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;

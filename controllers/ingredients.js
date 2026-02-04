// controllers/ingredients.js

const express = require('express');
const router = express.Router();

const Ingredient = require('../models/ingredient');
// const User = require('../models/user.js');
// const Recipe = require('../models/recipe.js');

// router logic will go here - will be built later on in the lab

// Show
router.get('/', async (req, res) => {
    try {
        const ingredients = await Ingredient.find().sort('name');
        res.locals.ingredients = ingredients;
        res.render('ingredients/index');
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
    });

// CREATE ingredient: POST /ingredients
router.post('/', async (req, res) => {
    try {
        const name = (req.body.name || '').trim();
        if (!name) return res.redirect('/ingredients');

        await Ingredient.create({ name });

        res.redirect('/recipes/new');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;


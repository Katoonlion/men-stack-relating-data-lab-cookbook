// middleware/is-recipe-owner.js
const Recipe = require('../models/recipe');

module.exports = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        if (!recipe) return res.redirect('/recipes');

        // Only owner
        if (!recipe.owner.equals(req.session.user._id)) {
        return res.redirect(`/recipes/${recipe._id}`);
        }

        res.locals.recipe = recipe; // optional: ส่งต่อให้ route ใช้
        next();
    } catch (err) {
        console.log(err);
        return res.redirect('/recipes');
    }
};

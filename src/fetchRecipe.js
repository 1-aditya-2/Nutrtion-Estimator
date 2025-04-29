const fs = require('fs');
const path = require('path');

// Fetching a recipe from dummyRecipes.json
function fetchRecipe(dishName) {
  return new Promise((resolve, reject) => {
    const recipePath = path.join(__dirname, '../recipes/dummyRecipes.json');

    fs.readFile(recipePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading recipe file:', err.message);
        return reject('Failed to read recipe file');
      }

      let recipes;
      try {
        recipes = JSON.parse(data);
      } catch (jsonErr) {
        console.error('Invalid JSON format in dummyRecipes.json:', jsonErr.message);
        return reject('Recipe data is corrupted or malformed');
      }

      if (!recipes || typeof recipes !== 'object') {
        return reject('Invalid recipe data structure');
      }

      const lowerDishName = dishName.toLowerCase();
      const matchedKey = Object.keys(recipes).find(
        key => key.toLowerCase() === lowerDishName
      );

      if (!matchedKey) {
        console.warn(`No recipe found for: "${dishName}"`);
        return reject(`No recipe found for: ${dishName}`);
      }

      const recipe = recipes[matchedKey];

      if (!Array.isArray(recipe)) {
        console.warn(`Recipe for "${dishName}" is not a valid ingredient list`);
        return reject(`Invalid recipe format for: ${dishName}`);
      }

      resolve(recipe);
    });
  });
}

module.exports = fetchRecipe;


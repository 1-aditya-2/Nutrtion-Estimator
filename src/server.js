const express = require('express');
const fetchRecipe = require('./fetchRecipe');
const { loadNutritionDatabase, matchIngredient } = require('./matchIngredients');
const { calculateTotalNutrition, scaleToServing, classifyDish, convertToGrams } = require('./helpers');

const app = express();
const port = 3000;

app.use(express.json());

// '/api/nutrition' is the api which is triggered for getting the recipe data
app.post('/api/nutrition', async (req, res) => {
  const { dishName } = req.body;
  if (!dishName) {
    console.log("Error getting the dish name.");
    return res.status(400).json({ error: 'Please provide the name of the dish, i.e. Dal Tadka!' });
  }

  try {
    const ingredients = await fetchRecipe(dishName);
    const nutritionDB = await loadNutritionDatabase();
    const dishType = classifyDish(dishName);
    const standardServingWeight = 180;

    let totalWeight = 0;
    const detailedIngredients = [];

    for (const { ingredient, quantity } of ingredients) {
      const matched = matchIngredient(ingredient, nutritionDB);
      const grams = convertToGrams(ingredient, quantity);
      if (grams) totalWeight += grams;

      detailedIngredients.push({
        ingredient,
        quantity,
        grams: grams || null,
        nutrition: matched || null,
      });
    }

    const totalNutrition = calculateTotalNutrition(detailedIngredients);
    const scaled = scaleToServing(totalNutrition, totalWeight, standardServingWeight);

    res.json({
      estimated_nutrition_per_200ml_katori: scaled,
      dish_type: dishType,
      ingredients_used: ingredients
    });

  } catch (err) {
    console.log("Error while getting the data.")
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(port, () => {
  console.log(`API is up and running at http://localhost:${port}`);
});

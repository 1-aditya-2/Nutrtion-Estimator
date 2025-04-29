const fetchRecipe = require('./fetchRecipe');
const { loadNutritionDatabase, matchIngredient } = require('./matchIngredients');
const { calculateTotalNutrition, scaleToServing, classifyDish, convertToGrams } = require('./helpers');

// To test out without the api
async function estimateNutrition(dishName) {
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

    console.log(JSON.stringify({
      estimated_nutrition_per_200ml_katori: scaled,
      dish_type: dishType,
      ingredients_used: ingredients
    }, null, 2));

  } catch (err) {
    console.error('Error:', err);
  }
}

estimateNutrition("Paneer Butter Masala");

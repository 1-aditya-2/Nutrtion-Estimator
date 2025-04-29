// Calculating the total nutrition values
function calculateTotalNutrition(ingredients) {
  const total = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

  ingredients.forEach(({ grams, nutrition }) => {
    if (!nutrition || !grams) return;

    total.calories += (grams * nutrition.calories) / 100;
    total.protein += (grams * nutrition.protein) / 100;
    total.carbs += (grams * nutrition.carbs) / 100;
    total.fat += (grams * nutrition.fat) / 100;
    total.fiber += (grams * nutrition.fiber) / 100;
  });

  return total;
}

// Scaling the nutriton according to the serving
function scaleToServing(totalNutrition, totalWeight, servingWeight = 180) {
  const factor = servingWeight / totalWeight;
  return {
    calories: Math.round(totalNutrition.calories * factor),
    protein: Math.round(totalNutrition.protein * factor),
    carbs: Math.round(totalNutrition.carbs * factor),
    fat: Math.round(totalNutrition.fat * factor),
    fiber: Math.round(totalNutrition.fiber * factor),
  };
}

// classify the dish according to the name
function classifyDish(dishName) {
    if (!dishName || typeof dishName !== 'string') return 'Wet Sabzi';
    const name = dishName.toLowerCase();
  
    if (name.includes('chicken') || name.includes('mutton') || name.includes('egg') || name.includes('fish')) {
      return 'Non-Veg Curry';
    }
    if (name.includes('dal') || name.includes('daal') || name.includes('lentil')) {
      return 'Dal';
    }
    if (name.includes('dry') || name.includes('stir fry') || name.includes('fry')) {
      return 'Dry Sabzi';
    }
    if (name.includes('sabzi') || name.includes('curry') || name.includes('masala') || name.includes('gravy')) {
      return 'Wet Sabzi';
    }
    return 'Wet Sabzi'; // default if nothing matches
}
  
const unitConversionTable = {
  cup: 240,
  tablespoon: 15,
  tbsp: 15,
  teaspoon: 5,
  tsp: 5,
  katori: 180,
  glass: 250,
};

const ingredientOverrides = {
  paneer: { cup: 120 },
  butter: { tablespoon: 14, teaspoon: 5 },
  cream: { tablespoon: 12 },
  onion: { cup: 100 },
  tomato: { cup: 100 },
};

function extractAmount(quantityStr) {
  const match = quantityStr.match(/[\d\.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function extractUnit(quantityStr) {
  const units = Object.keys(unitConversionTable);
  for (const unit of units) {
    if (quantityStr.toLowerCase().includes(unit)) return unit;
  }
  return null;
}

//converting the ingridients to grams
function convertToGrams(ingredientName, quantityStr) {
  const amount = extractAmount(quantityStr);
  const unit = extractUnit(quantityStr);
  if (!amount || !unit) return null;

  const override = ingredientOverrides[ingredientName.toLowerCase()];
  const weightPerUnit = override?.[unit] || unitConversionTable[unit];
  if (!weightPerUnit) return null;

  return amount * weightPerUnit;
}

module.exports = {
  calculateTotalNutrition,
  scaleToServing,
  classifyDish,
  convertToGrams,
};

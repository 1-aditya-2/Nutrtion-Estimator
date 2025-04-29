const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const stringSimilarity = require('string-similarity');

// Loading the nutrition database from CSV and normalize each row.
function loadNutritionDatabase() {
  return new Promise((resolve, reject) => {
    const results = [];
    const dbPath = path.join(__dirname, '../data/nutrition_source.csv');

    try {
      fs.createReadStream(dbPath)
        .pipe(csv())
        .on('data', (data) => {
          try {
            const ingredient = data?.food_name?.toLowerCase().trim();
            if (!ingredient) {
              console.warn('Skipping row with missing food_name');
              return;
            }

            results.push({
              ingredient,
              calories: parseFloat(data.energy_kcal) || 0,
              protein: parseFloat(data.protein_g) || 0,
              carbs: parseFloat(data.carb_g) || 0,
              fat: parseFloat(data.fat_g) || 0,
              fiber: parseFloat(data.fibre_g) || 0,
            });
          } catch (rowErr) {
            console.warn('Error processing row:', rowErr.message);
          }
        })
        .on('end', () => {
          if (results.length === 0) {
            return reject('Nutrition database is empty or all rows failed to parse.');
          }
          resolve(results);
        })
        .on('error', (err) => reject('Failed to load nutrition database: ' + err.message));
    } catch (e) {
      return reject('Could not read nutrition file: ' + e.message);
    }
  });
}

// Matches an ingredient name to the closest one in the nutrition database
function matchIngredient(rawIngredient, nutritionDB) {
  if (!rawIngredient || typeof rawIngredient !== 'string') {
    console.warn('Invalid raw ingredient:', rawIngredient);
    return null;
  }

  const dbNames = nutritionDB.map(item => item.ingredient);
  const { bestMatch } = stringSimilarity.findBestMatch(rawIngredient.toLowerCase(), dbNames);

  if (!bestMatch || bestMatch.rating < 0.5) {
    console.warn(`Low confidence match for "${rawIngredient}": closest = "${bestMatch?.target}".`);
    return null;
  }

  const match = nutritionDB.find(item => item.ingredient === bestMatch.target);
  if (!match) {
    console.warn(`Ingredient "${rawIngredient}" matched "${bestMatch.target}" but not found.`);
  }

  return match || null;
}

module.exports = {
  loadNutritionDatabase,
  matchIngredient,
};

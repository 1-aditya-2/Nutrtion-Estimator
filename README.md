# 🧠 VYB AI Nutrition Estimator

This is a Node.js-based prototype for estimating the **nutritional values of home-cooked Indian dishes**. It parses the ingredients of a dish, maps them to a nutrition database, converts quantities to grams, and calculates total and per-serving nutrition.

Hosted API link:  https://nutrtion-estimator-production.up.railway.app/api/nutrition/

---

## 📌 Features

- 🔎 **Dish Lookup** (case-insensitive)
- 🍽️ **Recipe to Nutrition Pipeline**:
  - Fetch recipe (from local JSON)
  - Match ingredients using fuzzy logic
  - Convert household units (e.g., cups, tsp) to grams
  - Map ingredients to IFCT-derived nutrition DB
  - Calculate nutrition per 100g → scale to serving
- 📊 **Per-serving estimation** (e.g., per 180g for Wet Sabzi)
- 🧾 **Local API (Express)** for real-time nutrition lookup
- ✅ **Graceful error handling** and real-world assumptions built-in

---

## 📂 Project Structure

```
vyb-ai-nutrition-estimator/
├── src/
│   ├── index.js                # CLI entry point
│   ├── server.js               # Express API
│   ├── fetchRecipe.js
│   ├── matchIngredients.js
│   ├── helpers.js
├── recipes/
│   └── dummyRecipes.json       # Contains mock recipes
├── data/
│   └── Assignment Inputs - Nutrition source.csv  # Actual nutrition DB
```

---

## ⚙️ Installation

```bash
clone the repo

npm install
```

---

## 🚀 Run the Local API

```bash
npm src/server.js
```

Then hit the API at:

```bash
curl -X POST http://localhost:3000/api/nutrition \
     -H "Content-Type: application/json" \
     -d "{\"dishName\": \"Paneer Butter Masala\"}"
```

---

## 🔄 Project Flow Explained

### 1. **User Input**
- Dish name is passed via:
  - CLI (`index.js`)
  - API (`POST /api/nutrition`)

---

### 2. **Fetch Recipe**
- `fetchRecipe.js`:
  - Loads `recipes/dummyRecipes.json`
  - Matches dish name (case-insensitive)
  - Returns ingredient list with household quantities

---

### 3. **Match Ingredients to Nutrition DB**
- `matchIngredients.js`:
  - Loads `Assignment Inputs - Nutrition source.csv`
  - Fuzzy-matches each ingredient name
  - Retrieves nutrition per 100g: Calories, Protein, Carbs, Fat, Fiber

---

### 4. **Convert Units to Grams**
- `convertUnits()`:
  - Parses quantities like `0.5 cup` or `2 teaspoons`
  - Uses general & ingredient-specific gram mappings
  - Converts household quantities to grams

---

### 5. **Calculate Nutrition**
- `calculateNutrition()`:
  - Calculates `(grams × nutrition per 100g) / 100` for each ingredient
  - Sums up total nutrition
  - Scales result to a standard serving (180g for Wet Sabzi)

---

### 6. **Classify the Dish**
- `classifyDish()`:
  - Uses dish name keywords to return type:
    - Wet Sabzi, Dry Sabzi, Dal, Non-Veg Curry

---

### 7. **Final Output**
- Returns JSON with:
  - `estimated_nutrition_per_200ml_katori`
  - `dish_type`
  - `ingredients_used`

---

### 8. **Failure Handling**
- Skips & logs issues like:
  - Missing ingredient in DB
  - Invalid unit or quantity
  - Outlier nutrition values
- System **never crashes**; fallback logic used

---

## 🧪 Sample Output

```json
{
  "estimated_nutrition_per_200ml_katori": {
    "calories": 280,
    "protein": 12,
    "carbs": 10,
    "fat": 18,
    "fiber": 1
  },
  "dish_type": "Wet Sabzi",
  "ingredients_used": [
    { "ingredient": "Paneer", "quantity": "0.75 cup cubes" },
    { "ingredient": "Butter", "quantity": "2 teaspoons" },
    { "ingredient": "Tomato", "quantity": "0.5 cup puree" },
    { "ingredient": "Onion", "quantity": "0.5 cup chopped" },
    { "ingredient": "Cream", "quantity": "1 tablespoon" }
  ]
}
```

---

## 💡 Assumptions Made

- Recipes serve 3–4 people; assumed full cooked weight ≈ 720–800g.
- Nutrition scaled to **180g per serving** (standard katori size).
- Water loss during cooking is ignored for simplicity.
- If an ingredient is not found, it's skipped with a warning.

---

## ⚠️ Failure Handling

- ❓ Missing or invalid recipe → handled with clear error messages.
- 🔍 Ingredient not found → logs warning and skips.
- 📏 Quantity parsing issues → defaulted or skipped gracefully.
- ⚡ No crash: fallback assumptions and logging built-in.

---

## ✅ Sample Dishes Supported

- Paneer Butter Masala
- Dal Tadka
- Chole Masala
- Aloo Gobi
- Palak Paneer
- Chicken Curry
- Egg Bhurji
- Mixed Vegetable Curry

---

## 📚 Tech Stack

- Node.js
- Express.js
- csv-parser
- string-similarity
- JSON recipe stubs (can be LLM/API integrated later)

---


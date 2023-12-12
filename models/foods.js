import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  Food: {
    type: String,
    required: true,
  },
  Measure: {
    type: String,
    required: true,
  },
  Grams: {
    type: String,
    required: true,
  },
  Calories: {
    type: String,         
    required: true,
  },
  Protein: {
    type: String,
    required: true,
  },
  Fat: {
    type: String,
    required: true,
  },
  SatFat: {
    type: String,
    required: true,
  },
  Fiber: {
    type: String,
    required: true,
  },
  Carbs: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
  },
});

const Foods = mongoose.model("foods", foodSchema);

export { Foods };

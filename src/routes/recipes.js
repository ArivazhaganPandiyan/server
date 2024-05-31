import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();

// Get all recipes
router.get("/", async (req, res) => {
  try {
    const result = await RecipesModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new recipe.
router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    creator: req.body.creator,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    cookingTime: req.body.cookingTime,
    userOwner: req.body.userOwner,
  });

  try {
    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        creator: result.creator,
        image: result.image,
        ingredients: result.ingredients,
        instructions: result.instructions,
        _id: result._id,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save a Recipe
router.put("/", async (req, res) => {
  const recipe = await RecipesModel.findById(req.body.recipeID);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get id of saved recipes
router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get saved recipes
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.status(201).json({ savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a saved recipe
router.delete("/savedRecipes/:recipeId/:userId", async (req, res) => {
  const { recipeId, userId } = req.params;

  try {
    const user = await UserModel.findById(userId);
    if (!user || !user.savedRecipes) {
      return res.status(404).json({ message: "User not found or has no saved recipes." });
    }

    const recipeIndex = user.savedRecipes.indexOf(recipeId);
    if (recipeIndex === -1) {
      return res.status(404).json({ message: "Recipe not found in user's saved recipes." });
    }

    user.savedRecipes.splice(recipeIndex, 1);
    await user.save();

    res.status(200).json({ message: "Recipe unsaved successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Delete a recipe by ID
router.delete("/:recipeId/:userId", async (req, res) => {
  const { recipeId, userId } = req.params;

  try {
    const recipe = await RecipesModel.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    if (recipe.userOwner.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this recipe." });
    }

    const deletedRecipe = await RecipesModel.findByIdAndDelete(recipeId);
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    res.status(200).json({ message: "Recipe deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get recipe details by ID
router.get("/details/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router as recipesRouter };

import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();



router.get("/", async (req, res) => {
  try {
    const result = await RecipesModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new recipe
router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    creator :req.body.creator,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    cookingTime: req.body.cookingTime,
    userOwner: req.body.userOwner,
  });
  console.log(recipe);

  try {
    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        creator : result.creator ,
        image: result.image,
        ingredients: result.ingredients,
        instructions: result.instructions,
        _id: result._id,
      },
    });
  } catch (err) {
    // console.log(err);
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
    console.log(err);
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

    console.log(savedRecipes);
    res.status(201).json({ savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/savedRecipes/:recipeId/:userId", async (req, res) => {
    const { recipeId, userId } = req.params;
  
    try {
      // Find the user by ID
      const user = await UserModel.findById(userId);
  
      // Check if the user exists and has saved recipes
      if (!user || !user.savedRecipes) {
        return res.status(404).json({ message: "User not found or has no saved recipes." });
      }
  
      // Check if the recipe ID is in the user's saved recipes
      const recipeIndex = user.savedRecipes.indexOf(recipeId);
      if (recipeIndex === -1) {
        return res.status(404).json({ message: "Recipe not found in user's saved recipes." });
      }
  
      // Remove the recipe ID from the user's saved recipes
      user.savedRecipes.splice(recipeIndex, 1);
  
      // Save the updated user object
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
    // Find the recipe by ID
    const recipe = await RecipesModel.findById(recipeId);

    // Check if the recipe exists
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    // Check if the user making the request is the owner of the recipe
    if (recipe.userOwner.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this recipe." });
    }

    // Attempt to delete the recipe by ID
    const deletedRecipe = await RecipesModel.findByIdAndDelete(recipeId);

    if (!deletedRecipe) {
      // If the recipe doesn't exist, return a 404 Not Found response
      return res.status(404).json({ message: "Recipe not found." });
    }

    // If the recipe is successfully deleted, return a success message
    res.status(200).json({ message: "Recipe deleted successfully." });
  } catch (err) {
    // If an error occurs, return a 500 Internal Server Error response
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

# Cooking Catalog Backend

This is the backend for the Cooking Catalog App, developed as a capstone project. The backend handles user authentication, recipe creation, retrieval, and saving.

## Source Code Structure

The backend source code is organized into several files:

- **index.js**: Main server file responsible for setting up the Express server, connecting to MongoDB, and defining API routes.
- **models/Recipes.js**: Defines the Mongoose schema for recipes, including fields such as name, creator, ingredients, instructions, imageUrl, cookingTime, and userOwner.
- **models/User.js**: Defines the Mongoose schema for users, including fields such as username, password, and savedRecipes.
- **routes/recipes.js**: Defines the API routes related to recipes, including endpoints for fetching all recipes, creating a new recipe, getting a recipe by ID, saving a recipe, getting saved recipes, and deleting a recipe.
- **routes/user.js**: Defines the API routes related to user authentication, including endpoints for user registration and login.

## Installation and Setup

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies using `npm install` or `yarn install`.
4. Create a `.env` file and define the following environment variables:
   - `PORT`: Port number for the Express server.
   - `MONGO_URL`: MongoDB connection URL.
   - `JWT_SECRET_KEY`: Secret key for JWT token generation.
5. Start the server using `npm start` or `yarn start`.

## Dependencies

- Express
- Mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- bode-parser

## Usage

- The backend server provides RESTful APIs for user authentication and recipe management.
- Users can register, login, create recipes, fetch recipes, save recipes, and delete recipes.
- only the user saved the recipe of therir own or others after logged in
- others login only after register therir account
- only users can create the recipe
- but anyone can see the recipe detail but can't create or sace or del any recipe 
- only the person who create recipe can delete that recipe others can only see and save the recipe
- Ensure proper authentication and authorization mechanisms are implemented to secure the endpoints.

## Frontend Source Code

Find the frontend source code on [GitHub](https://github.com/ArivazhaganPandiyan/client).

## Deployed Frontend

Access the deployed frontend on [Netlify](https://cooking-catalog.netlify.app/).

## Deployed Backend

Access the deployed backend server on [Render](https://server-578r.onrender.com).

## GitHub Repository

Find the backend source code on [GitHub](https://github.com/ArivazhaganPandiyan/server).

## Note

- This README assumes familiarity with Node.js, Express, MongoDB, and RESTful API concepts.
- Replace the environment variables in the `.env` file with appropriate values before running the server.


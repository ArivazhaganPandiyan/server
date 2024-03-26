import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/user.js";
import { recipesRouter } from "./routes/recipes.js";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

app.get('/', (request,response) => {
  console.log(request)
  return response.status.apply(234).send("server is connected 🌐 ")
});

// Connect to MongoDB database using Mongoose
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("Connected to MongoDB."))
.catch((err) => console.error("Could not connect to MongoDB", err));

// Start the server

app.listen(PORT, () => console.log("Server started on port 3001"));

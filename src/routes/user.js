import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
import { UserModel } from "../models/Users.js";

dotenv.config();
const SECRET = process.env.JWT_SECRET_KEY;
const router = express.Router();

// Route to handle user registration.
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  
  // Check if username already exists
  const user = await UserModel.findOne({ username });
  if (user) {
    return res.status(400).json({ message: "Username already exists" });
  }
  
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ username, password: hashedPassword });
  await newUser.save();
  
  res.json({ message: "User registered successfully" });
});

// Route to handle user login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "Username or password is incorrect" });
  }

  // Check if password is valid
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Username or password is incorrect" });
  }

  // Generate JWT token for authentication
  const token = jwt.sign({ id: user._id }, SECRET);
  res.json({ token, userID: user._id });
});

// Middleware function to verify JWT token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // Verify the token
    jwt.verify(authHeader, SECRET, (err) => {
      if (err) {
        return res.sendStatus(403); // Forbidden if token is invalid
      }
      next(); // Proceed to the next middleware if token is valid
    });
  } else {
    res.sendStatus(401); // Unauthorized if no token provided
  }
};

export { router as userRouter };

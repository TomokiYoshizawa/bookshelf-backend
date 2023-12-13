import express from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();
import { User } from "../db/user.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

router.get("/", (req, res) => {
  res.send("Hello auth");
});

//user registration, validatioon
router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //   checking if user already exists
    const user = User.find((user) => user.email === email);
    if (user) {
      return res.status(400).json([{ message: "User already exists" }]);
    }

    // cripting password
    let hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);

    //save it to db
    User.push({ email, password: hashedPassword });

    //issue JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return res.json({ token: token });
  }
);

//login api
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = User.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json([{ message: "User doesnt exist" }]);
  }

  //crypting and comparing password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json([{ message: "Incorrect password" }]);
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return res.json({ token: token });
});

//checking if user exists
router.get("/allUsers", (req, res) => {
  return res.json(User);
});
export default router;

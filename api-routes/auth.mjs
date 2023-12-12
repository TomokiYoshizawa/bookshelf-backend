import express from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();
import { User } from "../db/user.mjs";
import bcrypt from "bcrypt";

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
    console.log(hashedPassword);

    //save it to db
    User.push({ email, password: hashedPassword });
  }
);

export default router;

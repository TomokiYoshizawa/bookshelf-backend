import express from "express";
import apiRoutes from "./api-routes/index.mjs";
import "./helpers/db.mjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
import cors from "cors";

const { PORT } = process.env;

app.use(express.json()); // parse incoming requests with JSON payloads
app.use(cors()); // allow cross-origin requests
app.use(express.static("public/images"));

// API
app.use("/api", apiRoutes);
// when a path is not found
app.use((req, res) => {
  res.status(404).send("Not found");
});
// error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: "something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Express server running at ${PORT}`);
});
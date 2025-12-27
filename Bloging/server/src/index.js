import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import connectDB from "./db.js";
import postsRouter from "./routes/posts.js";
import { uploadsDir } from "./uploads.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const corsOrigin = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: corsOrigin }));
app.use(express.json());
fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/posts", postsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((error, req, res, next) => {
  if (error?.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({ message: "Maximum 5 attachments." });
  }
  if (error?.name === "MulterError") {
    return res.status(400).json({ message: error.message });
  }
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database", error);
    process.exit(1);
  });

import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import Post from "../models/Post.js";
import { uploadsDir } from "../uploads.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { files: 5 },
});

const mapPost = (post) => ({
  id: post._id.toString(),
  title: post.title,
  author: post.author,
  content: post.content,
  attachments: post.attachments ?? [],
  createdAt: post.createdAt,
});

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    res.json(posts.map(mapPost));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(id).lean();
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(mapPost(post));
  } catch (error) {
    next(error);
  }
});

router.post("/", upload.array("attachments", 5), async (req, res, next) => {
  try {
    const title = (req.body.title || "").trim();
    const author = (req.body.author || "").trim();
    const content = (req.body.content || "").trim();

    if (!title || !author || !content) {
      return res.status(400).json({
        message: "title, author, and content are required",
      });
    }

    const attachments = (req.files || []).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    }));

    const post = await Post.create({ title, author, content, attachments });
    res.status(201).json(mapPost(post));
  } catch (error) {
    next(error);
  }
});

export default router;

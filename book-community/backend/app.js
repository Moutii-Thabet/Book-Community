import express from "express";

import multer from "multer";
import bodyParser from "body-parser";
import cors from "cors";

//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

import { v4 as uuidv4 } from "uuid";

import authRoutes from "./routes/auth.js";
import communityRoutes from "./routes/community.js";
import adminRoutes from "./routes/admin.js";

import mongoose from "mongoose";

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = file.mimetype.split("/")[1];
  if (extension === "png" || extension === "jpg" || extension === "jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(multer({ storage, fileFilter }).single("image"));
app.use("/images", express.static("images"));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use("/auth", authRoutes);
app.use(communityRoutes);
app.use("/admin", adminRoutes);

app.use((error, req, res, next) => {
  const message = error.message;
  const statusCode = error.status;

  const data = error.data;
  console.log(message);
  console.log(data);
  res.status(statusCode).json({ message, errorData: data });
});

  try {
  await mongoose.connect(
    "mongodb+srv://Moutii:Thabete321@cluster0.7lhlzac.mongodb.net/books?retryWrites=true&w=majority&appName=Cluster0"
  );
  app.listen(3000, () => {
    console.log("listening on port 3000");
  });
} catch (error) {
  console.log("error");
}






// Environmental variables
import { configDotenv } from "dotenv";

configDotenv();

import express from "express";

// Middleware
import { sendError, validateToken } from "./utils";
import { deleteAccount, login, loginToken, register } from "./endpoints/auth";
import { fetchMe } from "./endpoints/profiles";
import {
  createFolder,
  deleteFile,
  deleteFolder,
  fetchFiles,
  fetchFoldersHome,
  getTotalUsage,
  renameFolder,
  uploadFile,
} from "./endpoints/filesystem";

// Target PORT
const PORT = process.env.PORT || 3000;

// Initialise app
const app = express();

// JSON requests only
app.use(express.json());

// Authentication
app.post("/register", register);
app.post("/login", login);
app.post("/loginToken", loginToken);
app.delete("/login", deleteAccount);

// Validate tokens from now on, all routes that don't need authentication should be placed above
app.use(async (req, res, next) => {
  const tokenVal = await validateToken(req);

  if (tokenVal.error) {
    return sendError(400, res, tokenVal.failure);
  }

  next();
});

// Profiles
app.get("/me", fetchMe);

// Filesystem

// Folders
app.get("/folders", fetchFoldersHome);

app.post("/folders", createFolder);
app.post("/folders/rename/:folderId", renameFolder);

app.delete("/folders/:folderId", deleteFolder);

// Files
app.get("/files/:folderId", fetchFiles);

app.post("/files/:folderId", uploadFile);

app.delete("/files/:folderId/:fileId", deleteFile);

// Other
app.get("/usage", getTotalUsage);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;

// Environmental variables
import { configDotenv } from "dotenv";

configDotenv();

import express from "express";

// Endpoints
import { deleteAccount, login, register } from "./endpoints/auth";
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

// Middleware
import { verifyJWT } from "./middleware/verifyJWT";
import { keepAlive } from "endpoints/other";

// Target PORT
const PORT = process.env.PORT || 3001;

// Initialise app
const app = express();

app.get("/keep-alive", keepAlive);

// JSON requests only
app.use(express.json());

// Keep alive

// Authentication
app.post("/register", register);
app.post("/login", login);

// JWT required for the routes below this middleware
app.use(verifyJWT);

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
app.delete("/login", deleteAccount);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;

import { compareSync, hashSync } from "bcrypt";
import { getParams, getV4, sendError, sendSuccess } from "../utils";
import { imagekit, prismaClient } from "../vars";
import { identifierSchema, emailSchema, passwordSchema } from "../schemas";
import { Request, Response } from "express";
import { StringSchema } from "@ezier/validate";
import jwt from "jsonwebtoken";

const registerSchema = new StringSchema({
  ...identifierSchema,
  ...emailSchema,
  ...passwordSchema,
});

const loginSchema = new StringSchema({
  ...emailSchema,
  ...passwordSchema,
});

export async function register(req: Request, res: Response) {
  const { identifier, email, password } = getParams(req, [
    "identifier",
    "email",
    "password",
  ]);

  // Validate params
  const schemaResult = registerSchema.validate({
    identifier,
    email,
    password,
  });

  if (schemaResult.length != 0) {
    return sendError(400, res, schemaResult, true);
  }

  // Should be unique email
  const uniqueRes = await prismaClient.account.findFirst({
    where: {
      email,
    },
  });

  if (uniqueRes) {
    return sendError(400, res, "Email in use");
  }

  // Should be unique identifier aswell
  const uniqueRes2 = await prismaClient.account.findFirst({
    where: {
      identifier,
    },
  });

  if (uniqueRes2) {
    return sendError(400, res, "Identifier in use");
  }

  // Create the account
  await prismaClient.account.create({
    data: {
      identifier,
      email,
      password: hashSync(password, 10),
    },
  });

  // Create default folder
  await prismaClient.folder.create({
    data: {
      ownerId: identifier,
      folderId: getV4(),
      title: "Litestore",
    },
  });

  const token = jwt.sign({ id: identifier }, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });

  const finalDict = { token };

  // Info for tests
  if (process.env.NODE_ENV == "test") {
    finalDict["id"] = identifier;
  }

  return sendSuccess(res, finalDict, true);
}

export async function login(req: Request, res: Response) {
  const { email, password } = getParams(req, ["email", "password"]);

  // Validate params
  const schemaResult = loginSchema.validate({
    email,
    password,
  });

  if (schemaResult.length != 0) {
    return sendError(400, res, schemaResult, true);
  }

  // Check if it's a valid account
  const accountObj = await prismaClient.account.findFirst({
    where: {
      email,
    },

    select: {
      password: true,
      identifier: true,
    },
  });

  if (!accountObj) return sendError(404, res, "Account not found");

  // Validate the password
  if (!compareSync(password, accountObj.password)) {
    return sendError(400, res, "Invalid password");
  }

  // Send JWT token
  const token = jwt.sign(
    { id: accountObj.identifier },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
    }
  );

  const finalDict = { token };

  // Info for tests
  if (process.env.NODE_ENV == "test") {
    finalDict["id"] = accountObj.identifier;
  }

  return sendSuccess(res, finalDict, true);
}

export async function deleteAccount(req: Request, res: Response) {
  // Match password
  const accountObj = await prismaClient.account.findFirst({
    where: {
      identifier: req.userId,
    },

    select: {
      identifier: true,
      password: true,
    },
  });

  const password = req.body.password;

  // Validate params
  const schemaResult = new StringSchema(passwordSchema).validate({
    password,
  });

  if (schemaResult.length != 0) {
    return sendError(400, res, schemaResult, true);
  }

  // Validate the password
  if (!compareSync(password, accountObj.password)) {
    return sendError(400, res, "Invalid password");
  }

  // Find owned folders
  const folders = await prismaClient.folder.findMany({
    where: {
      ownerId: accountObj.identifier,
    },

    select: {
      folderId: true,
    },
  });

  // Get all folder ids, avoid for loop for each folder
  const folderIds = folders.map((val) => val.folderId);

  // Delete files in target folders / created by user
  for (const folderIndex in folders) {
    const target = folders[folderIndex];
    const folderId = target.folderId;

    try {
      await imagekit.deleteFolder(folderId);
    } catch (e) {}

    // Delete all files
    await prismaClient.file.deleteMany({
      where: {
        folderId,
      },
    });
  }

  // Delete folders aswell
  await prismaClient.folder.deleteMany({
    where: {
      folderId: {
        in: folderIds,
      },
    },
  });

  // Finally, delete the account
  await prismaClient.account.delete({
    where: {
      identifier: accountObj.identifier,
    },
  });

  return sendSuccess(res, "Account deleted");
}

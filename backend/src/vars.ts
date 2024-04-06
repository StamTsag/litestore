import { PrismaClient } from "@prisma/client";
import ImageKit from "imagekit";

// Prisma ORM setup
export const prismaClient = new PrismaClient();
export const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
});

export const maxFolders = 25;
export const maxFolderFiles = 200;

// 25 MB
export const imagekitMaxSize = 25 * 1000 * 1000;

// 500 MB
export const maxSize = 500 * 1000 * 1000;

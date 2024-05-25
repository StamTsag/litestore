import { number, string } from "zod";

export const email = string().email();

export const password = string().min(8);

export const idSchema = string().regex(/[a-zA-Z0-9]+/);

export const titleSchema = string().max(30);

export const nameSchema = string().max(256);

export const sizeSchema = number();

export const urlSchema = string().regex(
  /https:\/\/ik.imagekit.io\/litestore\/[0-9A-Za-z]{12}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{12}\/[0-9A-Za-z]{8}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{12}\/[a-zA-Z0-9-.?=_]+/
);

export const widthSchema = number().optional();

export const heightSchema = number().optional();

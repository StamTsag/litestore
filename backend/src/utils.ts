import { v4 } from "uuid";
import { tokenSchema } from "./schemas";
import { prismaClient } from "./vars";
import { Request } from "express";

interface TokenMappings {
  [token: string]: string;
}

type FileType =
  | "image"
  | "audio"
  | "video"
  | "pdf"
  | "code"
  | "zip"
  | "executable"
  | "font"
  | "other";

const image =
  "png, jpg, jpeg, webp, icon, ico, svg, psd, tiff, tif, ai, bmp, ps".split(
    ", "
  );

const audio =
  "mp3, wav, ogg, m4a, flac, aif, cda, mid, midi, mpa, wma, wpl".split(", ");

const video =
  "mp4, webm, gif, avi, flv, h256, m4v, mkv, mov, mpg, mpeg, wmv".split(", ");

const code =
  "html, xhtml, htmx, css, js, jsx, cjs, mjs, ts, tsx, svelte, vue, py, c, c++, cpp, rs, ex, exs, pl, cgi, java, gd, cs, h, php, sh, swift, vb".split(
    ", "
  );

const zip = "7z, arj, deb, pkg, rar, rpm, gz, z, zip, tar".split(", ");

const executable = "apk, bat, exe, jar, msi, wsf, ini".split(", ");

const font = "fnt, fon, otf, ttf".split(", ");

const tokenMappings: TokenMappings[] = [];

export function getToken(req: Request): string {
  // In GET requests the token is in the Authorisation header
  return getParams(req, ["token"]).token || req.headers.authorization;
}

export function getTokens(): TokenMappings[] {
  return tokenMappings;
}

export function addToken(token: string, identifier: string): void {
  tokenMappings[token] = identifier;
}

export function getIdentifier(token: string): string {
  return tokenMappings[token];
}

export function getIdentifierReq(req: Request) {
  return tokenMappings[getToken(req)];
}

export function getV4(): string {
  return v4().replace(/-/, "");
}

export function getParams(
  req: { [key: string]: any },
  params: { [key: string]: any }
): { [key: string]: any } {
  const result = {};

  const payload = req.body;

  params.forEach((param: any) => {
    result[param] = payload[param];
  });

  return result;
}

export async function validateToken(req: Request): Promise<{
  [key: string]: any;
}> {
  const token = getToken(req);

  const tokenVal = tokenSchema.validate({ token });

  if (tokenVal.length != 0) {
    return {
      error: true,
      failure: "Invalid token format",
    };
  }

  // Avoid fetching if already available
  if (token in getTokens()) {
    return { identifier: getIdentifier(token) };
  }

  const tokenObj = await prismaClient.token.findFirst({
    where: {
      token,
    },

    select: {
      identifier: true,
    },
  });

  if (!tokenObj) {
    return {
      error: true,
      failure: "Invalid token",
    };
  }

  addToken(token, tokenObj.identifier);

  return tokenObj;
}

export function sendError(
  code: number,
  res: { [key: string]: any },
  msg: any,
  isSchema?: boolean
) {
  return res
    .status(code)
    .json(isSchema ? { errors: [...msg] } : { failure: msg });
}

export function sendSuccess(
  res: { [key: string]: any },
  msg: any,
  isRaw?: boolean
) {
  return res.status(200).json(isRaw ? { ...msg } : { success: msg });
}

export function getFileType(name: string): FileType {
  const ext = name.split(".").pop();

  if (image.includes(ext)) return "image";
  if (audio.includes(ext)) return "audio";
  if (video.includes(ext)) return "video";
  if (ext == "pdf") return "pdf";
  if (code.includes(ext)) return "code";
  if (zip.includes(ext)) return "zip";
  if (executable.includes(ext)) return "executable";
  if (font.includes(ext)) return "font";

  return "other";
}

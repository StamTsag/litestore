import { v4 } from "uuid";

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

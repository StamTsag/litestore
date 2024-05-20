import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FileType } from "./stores";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function getFileType(name: string): FileType {
  const ext = name.split(".").pop() as string;

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

export function formatBytes(bytes: number): string {
  if (!+bytes) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

import { writable } from "react-use-svelte-store";

export interface UserData {
  identifier: string;
  username: string;
  avatar: string;
  email: string;
  createdAt: string;
}

export enum SideOption {
  Starred,
  Home,
  Trash,
}

export interface Folder {
  folderId: string;
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  collaborators: string[];
}

export type FileType =
  | "image"
  | "audio"
  | "video"
  | "pdf"
  | "code"
  | "zip"
  | "executable"
  | "font"
  | "other";

export interface File {
  ownerId: string;
  folderId: string;
  fileId: string;
  name: string;
  size: number;
  url: string;
  width?: number;
  height?: number;
  type: FileType;
  createdAt: string;
}

export interface SelectedFile {
  id: string;
  filename: string;
  size: number;
  data: ArrayBuffer;
  progress: number;
  width: number;
  height: number;
}

export const hasToken = writable<boolean>(false);
export const authenticated = writable<boolean>(false);
export const userData = writable<UserData>();
export const sideOption = writable<SideOption>(SideOption.Home);
export const isMobile = writable<boolean>(false);

export const folders = writable<Folder[]>([]);
export const files = writable<File[]>([]);

export const isLoadingFiles = writable(false);
export const currentFolderId = writable("");

export const selectedFolder = writable<Folder>();

export const selectedFiles = writable<SelectedFile[]>([]);
export const isUploadingFiles = writable(false);

export const folderCache = writable<{ [key: string]: File[] }[]>([]);

// For Dialogs
export const creatingFolder = writable<boolean>(false);
export const uploadingFiles = writable<boolean>(false);

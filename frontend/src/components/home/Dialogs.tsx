"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useReadable, useWritable } from "react-use-svelte-store";
import {
  File as FileStore,
  SelectedFile,
  creatingFolder,
  currentFolderId,
  deletingFile,
  deletingFolder,
  files,
  folderCache,
  folders,
  isUploadingFiles,
  renamingFolder,
  selectedFiles,
  targetFile,
  targetFolder,
  terminatingAccount,
  uploadingFiles,
  viewingFile,
  viewingUsage,
} from "@/lib/stores";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import ImageKit from "imagekit-javascript";
import { formatBytes, getFileType } from "@/lib/utils";
import { v4 } from "uuid";
import {
  Cross1Icon,
  CrossCircledIcon,
  DownloadIcon,
  FontItalicIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import SelectedFileItem from "./SelectedFileItem";
import { Progress } from "../ui/progress";
import SyntaxHighlighter from "react-syntax-highlighter";

export default function Dialogs() {
  const $targetFolder = useReadable(targetFolder);
  const [$creatingFolder, setCreatingFolder] = useWritable(creatingFolder);
  const [$renamingFolder, setRenamingFolder] = useWritable(renamingFolder);
  const [$deletingFolder, setDeletingFolder] = useWritable(deletingFolder);
  const [$folders, setFolders] = useWritable(folders);
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);

  const [$files, setFiles] = useWritable(files);
  const [$uploadingFiles, setUploadingFiles] = useWritable(uploadingFiles);
  const [$isUploadingFiles, setIsUploadingFiles] =
    useWritable(isUploadingFiles);
  const [$selectedFiles, setSelectedFiles] = useWritable(selectedFiles);
  const [percentageUploaded, setPercentageUploaded] = useState(0);
  const [$folderCache, setFolderCache] = useWritable(folderCache);
  const [$currentFolderId, __] = useWritable(currentFolderId);
  const [$timeRemaining, setTimeRemaining] = useState(0);
  const [$usedSize, setUsedSize] = useState(0);

  const [$viewingUsage, setViewingUsage] = useWritable(viewingUsage);
  const [$usageLoaded, setUsageLoaded] = useState(false);
  const [$totalUsage, setTotalUsage] = useState(0);
  const [$usagePercentage, setUsagePercentage] = useState(0);

  const [$terminatingAccount, setTerminatingAccount] =
    useWritable(terminatingAccount);

  const $targetFile = useReadable(targetFile);
  const [$fileText, setFileText] = useState("");
  const [$numPages, setNumPages] = useState<number>();
  const [$pageNumber, setPageNumber] = useState<number>(1);
  const [$viewingFile, setViewingFile] = useWritable(viewingFile);
  const [$deletingFile, setDeletingFile] = useWritable(deletingFile);

  const name = $targetFile?.name;
  const url = $targetFile?.url;
  const type = $targetFile?.type;
  const width = $targetFile?.width;
  const height = $targetFile?.height;

  async function createFolder() {
    const element = document.getElementById("folder-title") as HTMLInputElement;

    const title = element.value.trim() as string;

    if (title.length == 0) {
      setCreatingFolder(false);

      return;
    }

    setDisabled(true);

    const res = await fetch("api/folders", {
      method: "POST",
      body: JSON.stringify({
        title,
      }),
      headers: {
        Authorization: Cookies.get("accessToken") as string,
        "content-type": "application/json",
      },
    });

    const resJson = await res.json();

    if (res.status == 200) {
      // @ts-ignore
      const folder = resJson.folder as Folder;

      setFolders([...$folders, folder]);

      setCreatingFolder(false);
    } else {
      // @ts-ignore
      setError(resJson.failure);
    }

    setDisabled(false);
  }

  async function renameFolder() {
    const element = document.getElementById("folder-title") as HTMLInputElement;

    const title = element.value.trim() as string;

    if (title.length == 0 || title === $targetFolder.title) {
      setRenamingFolder(false);

      return;
    }

    const folder = $targetFolder;

    const res = await fetch(`api/folders/rename/${folder.folderId}`, {
      method: "POST",
      body: JSON.stringify({
        title,
      }),
      headers: {
        Authorization: Cookies.get("accessToken") as string,
        "content-type": "application/json",
      },
    });

    const resJson = await res.json();

    if (res.status == 200) {
      const newFolders = $folders;

      for (const folderIndex in newFolders) {
        const target = newFolders[Number(folderIndex)];

        if (target.folderId == folder.folderId) {
          newFolders[folderIndex].title = title;

          setFolders(newFolders);

          break;
        }
      }

      setRenamingFolder(false);
    } else {
      // @ts-ignore
      setError(resJson.failure);
    }
  }

  async function deleteFolder() {
    setDisabled(true);

    const folder = $targetFolder;

    const res = await fetch(`api/folders/${folder.folderId}`, {
      method: "DELETE",
      headers: {
        Authorization: Cookies.get("accessToken") as string,
      },
    });

    if (res.status == 200) {
      for (const folderIndex in $folders) {
        const target = $folders[Number(folderIndex)];

        if (target.folderId == folder.folderId) {
          const newFolders = $folders.filter(
            (val) => val.folderId != folder.folderId
          );

          setFolders(newFolders);

          break;
        }
      }
    }

    setDeletingFolder(false);
    setDisabled(false);
  }

  useEffect(() => {
    setTimeout(() => {
      document
        .getElementById("folder-title")
        ?.addEventListener("keydown", (e) => {
          if (e.key == "Enter") {
            $creatingFolder ? createFolder() : renameFolder();
          }
        });
    }, 0);

    setTimeout(() => {
      setError("");
      setDisabled(false);
    }, 250);
  }, [$creatingFolder, $renamingFolder]);

  async function selectFiles() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;

    input.onchange = async (_) => {
      // @ts-ignore
      const files: File[] = [];

      for (const fileIndex in input.files) {
        const target = input.files[Number(fileIndex)];

        if (!target) continue;

        files.push(target);
      }

      addFiles(files);
    };

    input.click();
  }

  function addFiles(files: File[]) {
    let requiredFiles = 0;
    let completedFileEntries = 0;

    for (const fileIndex in files) {
      const file = files[fileIndex];

      if (!(file instanceof Blob)) continue;

      // Max 25MB, adjust for proofing
      if (file.size > 24500000) {
        continue;
      }

      if (Number(fileIndex) + $selectedFiles.length >= 200) {
        break;
      }

      requiredFiles++;
    }

    const newFilesToAdd: SelectedFile[] = [];

    for (const fileIndex in files) {
      const file = files[fileIndex];

      if (!(file instanceof Blob)) continue;

      // Max 25MB, adjust for proofing
      if (file.size > 24500000) {
        continue;
      }

      if ($selectedFiles.length + 1 >= 200) {
        break;
      }

      // Check max size
      const totalSize = $selectedFiles.reduce(
        (partialSum, a) => partialSum + a.size,
        0
      );

      if (totalSize + $usedSize + file.size >= 524288000) {
        setUploadingFiles(false);
        setViewingUsage(true);

        return;
      }

      const reader = new FileReader();

      function checkLoadingDone() {
        if (completedFileEntries == requiredFiles) {
          setSelectedFiles([...$selectedFiles, ...newFilesToAdd]);
        }
      }

      reader.addEventListener("load", async () => {
        if (
          getFileType(file.name) == "image" ||
          (getFileType(file.name) == "video" && file.name.endsWith(".gif"))
        ) {
          const image = new Image();
          // @ts-ignore
          image.src = reader.result;

          image.onload = () => {
            newFilesToAdd.push({
              id: v4(),
              filename: file.name,
              size: file.size,
              data: reader.result as ArrayBuffer,
              progress: 0,
              width: image.width,
              height: image.height,
            });

            completedFileEntries++;

            checkLoadingDone();
          };
        } else {
          newFilesToAdd.push({
            id: v4(),
            filename: file.name,
            size: file.size,
            data: reader.result as ArrayBuffer,
            progress: 0,
            width: 1,
            height: 1,
          });

          completedFileEntries++;

          checkLoadingDone();
        }
      });

      reader.readAsDataURL(file);
    }
  }

  async function uploadFiles() {
    if ($selectedFiles?.length == 0) {
      return;
    }

    setDisabled(true);
    setIsUploadingFiles(true);

    // Get imagekit basic options
    const authRes = (await (
      await fetch("uploadInit", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
    ).json()) as {
      publicKey: string;
      urlEndpoint: string;
    };

    const imagekit = new ImageKit({
      publicKey: authRes.publicKey,
      urlEndpoint: authRes.urlEndpoint,
    });

    async function uploadFile(
      file: SelectedFile,
      xhr: XMLHttpRequest,
      callback: (url: string) => void
    ) {
      // New auth for each file
      const auth = (await (
        await fetch("upload", {
          method: "POST",
          body: JSON.stringify({
            token: Cookies.get("accessToken") as string,
            folderId: $currentFolderId,
          }),
          headers: {
            "content-type": "application/json",
          },
        })
      ).json()) as {
        expire: number;
        token: string;
        signature: string;
      };

      imagekit
        .upload({
          xhr,
          // @ts-ignore
          file: file.data,
          fileName: file.filename,
          token: auth.token,
          signature: auth.signature,
          expire: auth.expire,
          folder: `${$currentFolderId}/${file.id}`,
          useUniqueFileName: false,
        })
        .then((val) => {
          callback(val.url);
        });
    }

    const filesToAdd: FileStore[] = [];

    const timeStarted = new Date();
    const uploadedBytesArr: number[] = [];
    let previousBytes = 0;

    // Calculate time remaining
    const elapsedController = setInterval(() => {
      const timeElapsed = Number(new Date()) - Number(timeStarted);

      const uploadedBytes: number = uploadedBytesArr.reduce(
        (partialSum, a) => partialSum + a,
        0
      );

      if (
        uploadedBytes == 0 ||
        previousBytes == uploadedBytes ||
        percentageUploaded == 100
      )
        return;

      previousBytes = uploadedBytes;

      const uploadSpeed = uploadedBytes / (timeElapsed / 1000);

      const fileSizes: number[] = [];

      for (const file of $selectedFiles) {
        fileSizes.push(file.size);
      }

      const totalBytes: number = fileSizes.reduce(
        (partialSum, a) => partialSum + a
      );

      setTimeRemaining((totalBytes - uploadedBytes) / uploadSpeed);
    }, 500);

    for (const fileIndex in $selectedFiles) {
      const file = $selectedFiles[fileIndex];
      const xhr = new XMLHttpRequest();

      uploadedBytesArr[fileIndex] = 0;

      xhr.upload.addEventListener("progress", function (e) {
        if (e.loaded <= file.size) {
          var percent = Math.round((e.loaded / file.size) * 100);

          // Update file upload tracking
          uploadedBytesArr[fileIndex] = e.loaded;

          $selectedFiles[fileIndex].progress = percent;

          let totalPercentage = 0;

          for (const percentageIndex in $selectedFiles) {
            const percentageTarget = $selectedFiles[percentageIndex];

            totalPercentage += percentageTarget.progress;
          }

          setPercentageUploaded(
            Math.round((totalPercentage / (100 * $selectedFiles.length)) * 100)
          );
        }

        if (e.loaded == e.total) {
          $selectedFiles[fileIndex].progress = 100;

          if (Number(fileIndex) == $selectedFiles.length - 1) {
            setPercentageUploaded(100);
          }
        }
      });

      await uploadFile(file, xhr, async (url) => {
        const fileRes = await fetch(`api/files/${$currentFolderId}`, {
          method: "POST",
          body: JSON.stringify({
            fileId: file.id,
            name: file.filename,
            size: file.size,
            url,
            width: file.width,
            height: file.height,
          }),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        // Out of storage most likely
        if (fileRes.status != 200) {
          setUploadingFiles(false);
          setIsUploadingFiles(false);
          setDisabled(false);
          setViewingUsage(true);

          return;
        }

        const fileJson = await fileRes.json();

        filesToAdd.push({ ...fileJson.file });

        if (filesToAdd.length == $selectedFiles.length) {
          const newCache = $folderCache;

          for (const folderIndex in $folderCache) {
            const target = $folderCache[folderIndex];
            const folderId = Object.keys(target)[0];

            if (folderId == $currentFolderId) {
              newCache[folderIndex][folderId] = [...$files, ...filesToAdd];

              setFolderCache(newCache);

              break;
            }
          }

          setFiles([...$files, ...filesToAdd]);

          setSelectedFiles([]);

          setPercentageUploaded(0);

          setIsUploadingFiles(false);
          setDisabled(false);

          clearInterval(elapsedController);
        }
      });
    }
  }

  async function loadUsage() {
    const res = await fetch("api/usage", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: Cookies.get("accessToken") as string,
      },
    });

    const resJson = await res.json();

    setTotalUsage(resJson.totalUsage as number);

    setUsagePercentage(Math.round((resJson.totalUsage / 524288000) * 100));

    setUsageLoaded(true);
  }

  useEffect(() => {
    async function loadUsedSize() {
      if ($usedSize == 0) {
        const res = await fetch("api/usage", {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: Cookies.get("accessToken") as string,
          },
        });

        const resJson = await res.json();

        setUsedSize(resJson.totalUsage as number);
      }
    }

    loadUsedSize();
  }, [$uploadingFiles]);

  useEffect(() => {
    if (!$viewingUsage) {
      setTimeout(() => {
        setTotalUsage(0);
        setUsagePercentage(0);
      }, 150);
    } else {
      loadUsage();
    }
  }, [$viewingUsage]);

  async function terminate() {
    const element = document.getElementById(
      "account-password"
    ) as HTMLInputElement;

    const password = element.value.trim() as string;

    if (password.length == 0) {
      return;
    }

    setDisabled(true);

    const res = await fetch("api/login", {
      method: "DELETE",
      body: JSON.stringify({
        password,
      }),
      headers: {
        Authorization: Cookies.get("accessToken") as string,
        "content-type": "application/json",
      },
    });

    if (res.status != 200) {
      const resJson = await res.json();

      setError(resJson.failure || resJson.errors[0].message);

      setDisabled(false);
    } else {
      Cookies.remove("refreshToken");
      Cookies.remove("accessToken");

      location.href = "/";
    }
  }

  useEffect(() => {
    if (!$terminatingAccount) {
      setTimeout(() => {
        setError("");
      }, 250);
    }
  }, [$terminatingAccount]);

  async function deleteFile() {
    setDisabled(true);

    const fileId = $targetFile.fileId;

    const res = await fetch(`api/files/${$currentFolderId}/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: Cookies.get("accessToken") as string,
      },
    });

    if (res.status == 200) {
      const newCache = $folderCache;

      for (const folderIndex in $folderCache) {
        const target = $folderCache[folderIndex];
        const folderId = Object.keys(target)[0];

        if (folderId == $currentFolderId) {
          newCache[folderIndex][folderId] = newCache[folderIndex][
            folderId
          ].filter((v) => v.fileId != fileId);

          setFolderCache(newCache);

          break;
        }
      }

      setFiles($files.filter((v) => v.fileId != fileId));
    }

    setDeletingFile(false);
  }

  function downloadFile() {
    window.open(`${url}?ik-attachment=true`, "_blank");
  }

  useEffect(() => {
    if (!$targetFile) return;

    setDisabled(false);
    setFileText("");

    async function loadFileText() {
      const type = $targetFile.type;

      if (type == "code" || type == "other" || type == "pdf") {
        setFileText(await (await fetch($targetFile.url)).text());
      }
    }

    loadFileText();
  }, [$targetFile]);

  return (
    <>
      <Dialog open={$creatingFolder} onOpenChange={setCreatingFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create folder</DialogTitle>
            <DialogDescription>
              A new root folder for your files
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <h1 className="text-destructive font-medium">{error}</h1>}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="folder-title" className="text-right">
                Name
              </Label>
              <Input maxLength={30} id="folder-title" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={disabled} type="submit" onClick={createFolder}>
              <PlusIcon className="mr-2" />
              Create folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$renamingFolder} onOpenChange={setRenamingFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename folder</DialogTitle>
            <DialogDescription>A new name for your folder</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <h1 className="text-destructive font-medium">{error}</h1>}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="folder-title" className="text-right">
                Name
              </Label>
              <Input
                defaultValue={$targetFolder?.title}
                id="folder-title"
                className="col-span-3"
                maxLength={30}
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={disabled} type="submit" onClick={renameFolder}>
              <FontItalicIcon className="mr-2" />
              Rename folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$deletingFolder} onOpenChange={setDeletingFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{$targetFolder?.title}</DialogTitle>
            <DialogDescription>
              Delete this folder permanently?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="items-end">
            <Button
              disabled={disabled}
              variant={"destructive"}
              onClick={deleteFolder}
              className="mt-2"
            >
              <TrashIcon className="mr-2" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$uploadingFiles} onOpenChange={setUploadingFiles}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Upload{$isUploadingFiles ? "ing" : ""} files
              {$isUploadingFiles ? `... (${percentageUploaded}%)` : ""}
            </DialogTitle>
            <DialogDescription>
              New files to add to this folder
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <h1 className="text-destructive font-medium">{error}</h1>}

            <div className="w-[100%] min-h-[30vh] flex flex-col items-center">
              {$selectedFiles.length == 0 ? (
                <div
                  id="file-upload"
                  className="flex flex-col w-full h-full items-center justify-center"
                >
                  <UploadIcon className="xs:min-w-[80px] xs:w-[80px] xs:min-h-[80px] xs:h-[80px] min-w-[100px] w-[100px] min-h-[100px] h-[100px]" />

                  <h1 className="xs:text-xs text-sm font-medium mt-2">
                    No files selected
                  </h1>
                </div>
              ) : (
                <div className="w-full">
                  {$selectedFiles.map((item) => {
                    return <SelectedFileItem key={item.id} {...item} />;
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="items-end">
            <Button
              disabled={disabled}
              variant={"outline"}
              onClick={selectFiles}
              className="mt-2"
            >
              <PlusIcon className="mr-2" /> Add files
            </Button>

            <div className="flex-1 flex items-center justify-center h-full font-medium text-sm tracking-tight">
              {disabled &&
                Math.round($timeRemaining) > 0 &&
                percentageUploaded != 100 && (
                  <h1>{Math.round($timeRemaining)}s remaining</h1>
                )}
            </div>

            <Button
              className="mt-2"
              disabled={disabled}
              type="submit"
              onClick={uploadFiles}
            >
              <UploadIcon className="mr-2" /> Upload files
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$viewingUsage} onOpenChange={setViewingUsage}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Data usage</DialogTitle>
            <DialogDescription>
              The amount of storage occupied
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <h1 className="text-destructive font-medium">{error}</h1>}

            <div className="w-[100%] min-h-[30vh] flex flex-col items-center">
              <div className="flex flex-col w-full h-full items-center justify-center">
                <Progress
                  className="w-[200px] h-[20px]"
                  value={$usagePercentage}
                />

                <h1 className="text-sm font-medium mt-2">
                  {$usageLoaded
                    ? `${formatBytes(
                        $totalUsage
                      )} / 500MB (${$usagePercentage}%)`
                    : "Calculating usage..."}
                </h1>
              </div>
            </div>
          </div>
          <DialogFooter className="items-end">
            <Button
              disabled={disabled}
              variant={"outline"}
              onClick={() => setViewingUsage(false)}
              className="mt-2"
            >
              <Cross1Icon className="mr-2" /> Close
            </Button>

            <span className="flex-1" />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$terminatingAccount} onOpenChange={setTerminatingAccount}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminate account</DialogTitle>
            <DialogDescription>
              Delete your Litestore account here
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <h1 className="text-destructive font-medium">{error}</h1>}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account-password" className="text-right">
                Password
              </Label>
              <Input
                type="password"
                id="account-password"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={disabled} type="submit" onClick={terminate}>
              <CrossCircledIcon className="mr-2" />
              Delete my account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$viewingFile} onOpenChange={setViewingFile}>
        <DialogContent className="overflow-hidden">
          <DialogHeader>
            <DialogTitle className="max-w-[400px] pb-2 translate-y-[-8px] overflow-hidden text-ellipsis whitespace-nowrap">
              {$targetFile?.name}
            </DialogTitle>
          </DialogHeader>

          {(type == "image" || (type == "video" && name.endsWith(".gif"))) && (
            <img
              src={`${url}`}
              alt={name}
              className={`xs:w-[50%] xs:h-[50%] transition-[100ms] rounded-[10px]`}
              draggable={false}
              width={width}
              height={height}
            />
          )}

          {type == "audio" && (
            <audio className="w-full" controls>
              <source src={url} type="audio/ogg" />
            </audio>
          )}

          {type == "video" && !name.endsWith(".gif") && (
            <>
              <video className="w-full" controls src={url} />
            </>
          )}

          {/* TODO: PDF Viewer */}
          {type == "pdf" && (
            <>
              <h1 className="xs:text-sm text-lg font-semibold text-center m-10">
                No preview available
              </h1>
            </>
          )}

          {/* TODO: Syntax highlighter*/}
          {type == "code" && (
            <>
              <h1 className="xs:text-sm text-lg font-semibold text-center m-10">
                No preview available
              </h1>
            </>
          )}

          {(type == "zip" ||
            type == "executable" ||
            type == "font" ||
            type == "other") && (
            <>
              <h1 className="xs:text-sm text-lg font-semibold text-center m-10">
                No preview available
              </h1>
            </>
          )}

          <DialogFooter className="items-end">
            <Button
              disabled={disabled}
              variant={"outline"}
              onClick={() => setViewingFile(false)}
              className="mt-2"
            >
              <Cross1Icon className="mr-2" /> Close
            </Button>

            <span className="flex-1" />

            <Button variant={"default"} onClick={downloadFile}>
              <DownloadIcon className="mr-2" /> Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$deletingFile} onOpenChange={setDeletingFile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{$targetFile?.name}</DialogTitle>
            <DialogDescription>Delete this file permanently?</DialogDescription>
          </DialogHeader>

          <DialogFooter className="items-end">
            <Button
              disabled={disabled}
              variant={"destructive"}
              onClick={deleteFile}
              className="mt-2"
            >
              <TrashIcon className="mr-2" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

import {
  File as FileStore,
  Folder,
  SelectedFile,
  SideOption,
  creatingFolder,
  currentFolderId,
  files,
  folderCache,
  folders,
  isMobile,
  isUploadingFiles,
  selectedFiles,
  sideOption,
  uploadingFiles,
} from "@/app/stores";
import {
  AttachFile,
  Backup,
  Close,
  CreateNewFolder,
  CreateNewFolderOutlined,
  DriveFolderUpload,
  HomeMax,
  UploadFileOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  SxProps,
  TextField,
  Theme,
  Typography,
  styled,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useReadable, useWritable } from "react-use-svelte-store";
import SelectedFileItem from "./SelectedFileItem";
import { v4 } from "uuid";
import ImageKit from "imagekit-javascript";
import { getFileType } from "@/app/utils";

const SideButton = styled(Button)({
  width: "90%",
  borderRadius: 7,
  justifyContent: "start",
  margin: 0.5,
  marginBottom: 3,
  marginTop: 3,
});

const TextFieldStyled = styled(TextField)({
  marginTop: 6,
});

const activeSx: SxProps<Theme> = {
  background: "#00afef",
  ":hover": {
    background: "#00a0ef",
  },
  ":active": {
    background: "#00a0ef",
    color: "white",
  },
};

export default function SideOptions() {
  const router = useRouter();

  const $isMobile = useReadable(isMobile);
  const [$creatingFolder, setCreatingFolder] = useWritable(creatingFolder);
  const [$uploadingFiles, setUploadingFiles] = useWritable(uploadingFiles);
  const [$sideOption, setSideOption] = useWritable(sideOption);
  const [$currentFolderId, setCurrentFolderId] = useWritable(currentFolderId);
  const [$folders, setFolders] = useWritable(folders);
  const [$files, setFiles] = useWritable(files);
  const [folderError, setFolderError] = useState("");
  const [$isUploadingFiles, setIsUploadingFiles] =
    useWritable(isUploadingFiles);
  const [$selectedFiles, setSelectedFiles] = useWritable(selectedFiles);
  const [percentageUploaded, setPercentageUploaded] = useState(0);
  const [$folderCache, setFolderCache] = useWritable(folderCache);

  const handleCreateFolder = () => {
    setCreatingFolder(true);

    setTimeout(() => {
      (document.getElementById("folder-title") as HTMLInputElement)?.focus();
    }, 0);
  };

  const handleCloseFolder = () => {
    setCreatingFolder(false);

    setTimeout(() => {
      setFolderError("");
    }, 250);
  };

  async function createFolder() {
    const element = document.getElementById("folder-title") as HTMLInputElement;

    const title = element.value.trim() as string;

    if (title.length == 0) {
      handleCloseFolder();

      return;
    }

    const res = await fetch("api/folders", {
      method: "POST",
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        title,
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    const resJson = await res.json();

    if (res.status == 200) {
      // @ts-ignore
      const folder = resJson.folder as Folder;

      setFolders([...$folders, folder]);

      handleCloseFolder();
    } else {
      // @ts-ignore
      setFolderError(resJson.failure);
    }
  }

  const handleUploadFiles = () => {
    setUploadingFiles(true);

    setTimeout(() => {
      addDropListener();
    }, 0);
  };

  const handleCloseUpload = () => {
    if ($isUploadingFiles) return;

    setUploadingFiles(false);

    setTimeout(() => {
      setSelectedFiles([]);
    }, 250);
  };

  async function selectFiles() {
    if ($isUploadingFiles) return;

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

  function addDropListener(): void {
    const element = document.getElementById("file-upload") as HTMLDivElement;

    if (!element) return;

    element.addEventListener("dragover", (e) => {
      e.stopPropagation();
      e.preventDefault();

      // @ts-ignore
      e.dataTransfer.dropEffect = "copy";

      element.style.opacity = "0.5";
    });

    element.addEventListener("dragend", () => {
      element.style.opacity = "1";
    });

    element.addEventListener("dragleave", () => {
      element.style.opacity = "1";
    });

    element.addEventListener("drop", (e) => {
      const dataTransfer = e.dataTransfer as DataTransfer;

      e.stopPropagation();
      e.preventDefault();

      element.style.opacity = "1";

      const files: File[] = [];

      for (const fileIndex in dataTransfer.files) {
        const target = dataTransfer.files[fileIndex];

        if (!target) continue;

        files.push(target);
      }

      addFiles(files);
    });
  }

  function addFiles(files: File[]) {
    const newFilesToAdd: SelectedFile[] = [];
    let completedFileEntries = 0;

    for (const fileIndex in files) {
      const file = files[fileIndex];

      if (!(file instanceof Blob)) continue;

      // Max 25MB, adjust for proofing
      if (file.size > 24500000) {
        continue;
      }

      if (
        Number(fileIndex) + completedFileEntries + $selectedFiles.length >=
        200
      ) {
        break;
      }

      const reader = new FileReader();

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
        }
      });

      reader.readAsDataURL(file);
    }

    setTimeout(() => {
      if (completedFileEntries == newFilesToAdd.length) {
        setSelectedFiles([...$selectedFiles, ...newFilesToAdd]);
      }
    }, 25);
  }

  async function uploadFiles() {
    if ($isUploadingFiles) return;

    setIsUploadingFiles(true);

    // Get imagekit basic options
    const authRes = (await (
      await fetch("uploadInit", {
        method: "POST",
        body: JSON.stringify({
          token: localStorage.getItem("token"),
        }),
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
            token: localStorage.getItem("token"),
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

    for (const fileIndex in $selectedFiles) {
      const file = $selectedFiles[fileIndex];
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", function (e) {
        if (e.loaded <= file.size) {
          var percent = Math.round((e.loaded / file.size) * 100);

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
            token: localStorage.getItem("token"),
            fileId: file.id,
            name: file.filename,
            size: file.size,
            url,
            width: file.width,
            height: file.height,
          }),
          headers: {
            "content-type": "application/json",
          },
        });

        // Out of storage most likely
        if (fileRes.status != 200) {
          handleCloseUpload();

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
        }
      });
    }
  }

  const handleHome = () => {
    setSideOption(SideOption.Home);

    router.replace("/home");

    // @ts-ignore
    setCurrentFolderId(undefined);

    setFiles([]);
  };

  useEffect(() => {
    uploadingFiles.subscribe((val) => {
      if (val) addDropListener();
    });
  }, []);

  return (
    <div
      className={`flex flex-col items-center ${!$isMobile && "min-w-[200px]"} ${
        !$isMobile && "w-[200px]"
      } ${$isMobile && "min-w-0"} ${$isMobile && "w-0"} h-screen border-r pt-2`}
    >
      {!$isMobile && (
        <>
          <SideButton
            onClick={handleHome}
            sx={
              $sideOption == SideOption.Home && !$currentFolderId
                ? activeSx
                : {}
            }
          >
            <HomeMax
              sx={{
                fill:
                  $sideOption == SideOption.Home && !$currentFolderId
                    ? "white"
                    : "00afef",
                marginRight: 1,
              }}
            />

            <Typography
              sx={{
                fontSize: {
                  xs: "0.9rem",
                  sm: "0.9rem",
                  md: "1rem",
                },
              }}
              textTransform="none"
              color={
                $sideOption == SideOption.Home && !$currentFolderId
                  ? "white"
                  : "black"
              }
            >
              Home
            </Typography>
          </SideButton>

          <Divider
            orientation="horizontal"
            sx={{ height: "1px", width: "90%", margin: 1 }}
          />

          {$sideOption == SideOption.Home && (
            <>
              {!$currentFolderId ? (
                <SideButton onClick={handleCreateFolder}>
                  <CreateNewFolderOutlined
                    sx={{
                      fill: "00afef",
                      marginRight: 1,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: {
                        xs: "0.9rem",
                        sm: "0.9rem",
                        md: "1rem",
                      },
                    }}
                    textTransform="none"
                    color="black"
                  >
                    New folder
                  </Typography>
                </SideButton>
              ) : (
                <SideButton onClick={handleUploadFiles}>
                  <UploadFileOutlined
                    sx={{
                      fill: "00afef",
                      marginRight: 1,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: {
                        xs: "0.9rem",
                        sm: "0.9rem",
                        md: "1rem",
                      },
                    }}
                    textTransform="none"
                    color="black"
                  >
                    Upload files
                  </Typography>
                </SideButton>
              )}
            </>
          )}
        </>
      )}

      <Dialog
        fullWidth={true}
        maxWidth="xs"
        open={$creatingFolder}
        onClose={handleCloseFolder}
        PaperProps={{
          component: "form",
          onSubmit: (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            handleCreateFolder();
          },
        }}
      >
        <DialogTitle>Create Folder</DialogTitle>
        <DialogContent>
          <TextFieldStyled
            autoFocus
            label="Folder name"
            fullWidth
            variant="outlined"
            inputProps={{
              id: "folder-title",
              maxLength: 30,
            }}
            error={folderError.length > 0}
            helperText={folderError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFolder}>Cancel</Button>
          <Button
            variant="contained"
            sx={{
              color: "white",
            }}
            type="submit"
            onClick={createFolder}
          >
            <CreateNewFolder sx={{ marginRight: 1 }} />
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={$uploadingFiles}
        onClose={handleUploadFiles}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>
              Upload
              {$isUploadingFiles
                ? "ing"
                : ` ${
                    $selectedFiles.length > 0 ? $selectedFiles.length : ""
                  }`}{" "}
              file{$selectedFiles.length != 1 ? "s" : ""}
              {$isUploadingFiles && ` (${percentageUploaded}%)`}
            </Box>
            <Box>
              <IconButton onClick={handleCloseUpload}>
                <Close
                  sx={{
                    width: 26,
                    height: 26,
                    visibility: $isUploadingFiles ? "hidden" : "",
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "50vh",
            minHeight: "300px",
            paddingTop: 0,
            transition: "150ms",
          }}
          id="file-upload"
        >
          {$selectedFiles.length == 0 ? (
            <>
              <DriveFolderUpload
                sx={{
                  width: 128,
                  height: 128,
                }}
              />

              <Typography
                sx={{
                  fontSize: {
                    xs: "0.9rem",
                    sm: "0.9rem",
                    md: "1.1rem",
                  },
                  fontWeight: 500,
                }}
              >
                No files selected
              </Typography>
            </>
          ) : (
            <div className="w-full h-[100%]">
              {$selectedFiles.map((item) => {
                return <SelectedFileItem {...item} />;
              })}
            </div>
          )}
        </DialogContent>

        <Divider />

        <DialogActions>
          {!$isUploadingFiles ? (
            <Button
              sx={{
                paddingLeft: 1.5,
              }}
              onClick={selectFiles}
              disabled={$selectedFiles.length + $files.length >= 200}
            >
              <AttachFile sx={{ marginRight: 0.5 }} />
              Add files
            </Button>
          ) : (
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{
                color: "white",
              }}
            />
          )}

          <span className="flex-1" />
          <Button
            variant="contained"
            sx={{
              color: "white",
              paddingLeft: 1.5,
            }}
            onClick={uploadFiles}
            disabled={$selectedFiles.length == 0 || $isUploadingFiles}
          >
            <Backup sx={{ marginRight: 1 }} />
            Upload files
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

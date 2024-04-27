import { File, currentFolderId, files, folderCache } from "@/app/stores";
import { formatBytes } from "@/app/utils";
import {
  AudioFile,
  Delete,
  DeleteForever,
  Download,
  FolderZip,
  TextFields,
  VideoFile,
  Visibility,
} from "@mui/icons-material";
import {
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import moment from "moment";
import { FormEvent, useEffect, useState } from "react";
import { useReadable, useWritable } from "react-use-svelte-store";
import SyntaxHighlighter from "react-syntax-highlighter";
import { pdfjs, Document, Page } from "react-pdf";
import Cookies from "js-cookie";

export default function FolderItem({
  fileId,
  name,
  size,
  url,
  width,
  height,
  type,
  createdAt,
}: File) {
  const $currentFolderId = useReadable(currentFolderId);
  const [$files, setFiles] = useWritable(files);
  const [$deletingFile, setDeletingFile] = useState(false);
  const [isProgressing, setIsProgressing] = useState(false);
  const [$folderCache, setFolderCache] = useWritable(folderCache);
  const [$viewingFile, setViewingFile] = useState(false);
  const [$fileText, setFileText] = useState("");
  const [$numPages, setNumPages] = useState<number>();
  const [$pageNumber, setPageNumber] = useState<number>(1);

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 5,
            mouseY: event.clientY + 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleCloseOpenFile = () => {
    setViewingFile(false);
    setPageNumber(1);
  };

  async function openFile() {
    if (type == "code" || type == "other" || type == "pdf") {
      if (!$fileText) {
        setFileText(await (await fetch(url)).text());
      }
    }

    handleClose();

    setViewingFile(true);
  }

  function downloadFile() {
    if (type == "video") {
      window.open(`${url}`, "_blank");
    } else {
      window.open(`${url}?ik-attachment=true`, "_blank");
    }
  }

  const handleDeleteFile = () => {
    handleClose();

    setDeletingFile(true);
  };

  const handleCloseDeleteFile = () => {
    setDeletingFile(false);
  };

  async function deleteFile() {
    if (isProgressing) return;

    setIsProgressing(true);

    const res = await fetch(`api/files/${$currentFolderId}/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: Cookies.get("litestore_token") as string,
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

    handleCloseDeleteFile();

    setIsProgressing(false);
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.js",
      import.meta.url
    ).toString();
  }, []);

  return (
    <div
      className={`flex items-center w-full select-none border-lg border-b-[1px]`}
      key={fileId}
      onContextMenu={() => {}}
    >
      <ButtonBase
        sx={{
          width: "100%",
          padding: 1,
          paddingRight: 1.5,
          ":hover": {
            background: "transparent",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          borderRadius: "0px",
          "& .MuiTouchRipple-root .MuiTouchRipple-child": {
            width: "100%",
            borderRadius: "0px",
          },
          "&& .MuiTouchRipple-rippleVisible": {
            animationDuration: "750ms",
          },
        }}
        onClick={openFile}
        onContextMenu={handleContextMenu}
      >
        {(type == "image" || (type == "video" && name.endsWith(".gif"))) && (
          <img
            src={`${url}/tr:pr-true,q-90,w-96,h-96`}
            alt={name}
            className="transition-[100ms] w-[48px] h-[48px] rounded"
            draggable={false}
          />
        )}

        {type == "audio" && (
          <AudioFile
            sx={{
              width: "48px",
              height: "48px",
              fill: "#00afef",
            }}
          />
        )}

        {type == "video" && !name.endsWith(".gif") && (
          <VideoFile
            sx={{
              width: "48px",
              height: "48px",
              fill: "#00afef",
            }}
          />
        )}

        {type == "pdf" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            className="w-[48px] h-[48px] align-center"
          >
            <path
              d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023c.479 0 .774-.242.774-.651c0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018c.817.006 1.349-.444 1.349-1.396c.006-.83-.479-1.268-1.255-1.268z"
              fill="#00afef"
            />
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319c.254.202.426.533.426.923c-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515c-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426c.415.308.675.799.675 1.504c0 .763-.279 1.29-.663 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z"
              fill="#00afef"
            />
          </svg>
        )}

        {type == "code" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            className="w-[48px] h-[48px] align-center"
          >
            <path
              fill="#00afef"
              d="M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m.12 13.5l3.74 3.74l1.42-1.41l-2.33-2.33l2.33-2.33l-1.42-1.41zm11.16 0l-3.74-3.74l-1.42 1.41l2.33 2.33l-2.33 2.33l1.42 1.41z"
            />
          </svg>
        )}

        {type == "zip" && (
          <FolderZip
            sx={{
              width: "48px",
              height: "48px",
              alignSelf: "center",
              fill: "#00afef",
            }}
          />
        )}

        {type == "executable" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            className="w-[48px] h-[48px] align-center"
          >
            <path
              fill="#00afef"
              d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8zm.5 16.9L12 17.5L9.5 19l.7-2.8L8 14.3l2.9-.2l1.1-2.7l1.1 2.6l2.9.2l-2.2 1.9zM13 9V3.5L18.5 9z"
            />
          </svg>
        )}

        {type == "font" && (
          <TextFields
            sx={{
              width: "48px",
              height: "48px",
              alignSelf: "center",
              fill: "#00afef",
            }}
          />
        )}

        {type == "other" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            className="w-[48px] h-[48px] align-center"
          >
            <path
              fill="#00afef"
              d="M6 2c-1.11 0-2 .89-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm7 1.5L18.5 9H13zM12 11a3 3 0 0 1 3 3c0 1.88-2.25 2.06-2.25 3.75h-1.5c0-2.44 2.25-2.25 2.25-3.75a1.5 1.5 0 0 0-1.5-1.5a1.5 1.5 0 0 0-1.5 1.5H9a3 3 0 0 1 3-3m-.75 7.5h1.5V20h-1.5z"
            />
          </svg>
        )}

        <Typography
          sx={{
            fontSize: {
              xs: "0.8rem",
              sm: "0.8rem",
              md: "0.9rem",
            },
            padding: 0,
            margin: 0,
            overflow: "hidden",
            maxWidth: 500,
            minHeight: 25,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginLeft: 1,
          }}
        >
          {name}
        </Typography>

        <Typography
          sx={{
            fontSize: {
              xs: "0.7rem",
              sm: "0.7rem",
              md: "0.8rem",
            },
            padding: 0,
            margin: 0,

            overflow: "hidden",
            maxWidth: 300,
            minHeight: 25,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginLeft: 1,
            marginTop: 0.5,
            opacity: 0.4,
          }}
        >
          {formatBytes(size)}
        </Typography>

        <span className="flex-1" />

        <Typography
          sx={{
            fontSize: {
              xs: "0.6rem",
              sm: "0.6rem",
              md: "0.7rem",
            },
            padding: 0,
            margin: 0,
            overflow: "hidden",
            maxWidth: 300,
            minHeight: 25,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginLeft: 1,
            opacity: 0.75,
          }}
        >
          {moment(createdAt).format("DD/MM/YYYY HH:mm")}
        </Typography>
      </ButtonBase>

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={openFile}>
          <Typography
            sx={{
              width: 125,
            }}
          >
            View
          </Typography>

          <Visibility
            sx={{
              marginLeft: 5,
            }}
          />
        </MenuItem>

        <Divider />

        <MenuItem onClick={downloadFile}>
          <Typography
            sx={{
              width: 125,
            }}
          >
            Download
          </Typography>

          <Download
            sx={{
              marginLeft: 5,
            }}
          />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleDeleteFile}>
          <Typography
            sx={{
              width: 125,
            }}
          >
            Delete
          </Typography>

          <Delete
            sx={{
              marginLeft: 5,
            }}
          />
        </MenuItem>
      </Menu>

      <Dialog
        fullWidth={true}
        maxWidth="xs"
        open={$deletingFile}
        onClose={handleCloseDeleteFile}
        PaperProps={{
          component: "form",
          onSubmit: (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            handleDeleteFile();
          },
        }}
      >
        <DialogTitle>Delete {name}</DialogTitle>
        <DialogContentText
          sx={{
            marginLeft: 3,
          }}
        >
          Deleting a file permanently can't be reversed
        </DialogContentText>

        <Divider sx={{ marginTop: 4 }} />

        <DialogActions>
          <Button onClick={handleCloseDeleteFile}>Cancel</Button>
          <Button
            variant="contained"
            sx={{
              color: "white",
              paddingLeft: 1.5,
            }}
            type="submit"
            onClick={deleteFile}
          >
            <DeleteForever sx={{ marginRight: 0.5 }} />
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        maxWidth={"xl"}
        open={$viewingFile}
        onClose={handleCloseOpenFile}
        PaperProps={{
          sx: {
            background: "rgb(255, 255, 255, 0.1)",
            boxShadow: "none",
            maxHeight: "100vh",
          },
        }}
      >
        <DialogTitle align="center" color={"white"} padding={0} margin={0}>
          {name}
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",

            overflowX: "hidden",
          }}
        >
          {(type == "image" || (type == "video" && name.endsWith(".gif"))) && (
            <img
              src={`${url}/tr:pr-true`}
              alt={name}
              className={`transition-[100ms] rounded-[5px]`}
              draggable={false}
              width={width}
              height={height}
            />
          )}

          {type == "audio" && (
            <audio controls>
              <source src={url} type="audio/ogg" />
            </audio>
          )}

          {type == "video" && !name.endsWith(".gif") && (
            <>
              <VideoFile
                sx={{
                  width: "256px",
                  height: "256px",
                  alignSelf: "center",
                  fill: "#ffffff",
                }}
              />

              <Button
                onClick={downloadFile}
                variant="contained"
                sx={{ color: "white" }}
              >
                Download
              </Button>
            </>
          )}

          {type == "pdf" && (
            <div className="min-h-[100vh]">
              <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={$pageNumber} />
              </Document>
              <div className="select-none fixed bottom-3 right-0 left-0 m-auto z-1 bg-dark-half flex items-center justify-center w-max p-2 pl-7 pr-7 rounded-full">
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    color: "white",
                  }}
                >
                  Page
                  <input
                    placeholder={$pageNumber.toString()}
                    type="number"
                    maxLength={3}
                    className="w-[40px] bg-dark-half rounded-max ml-2 mr-2 text-center"
                    onChange={(e) => {
                      const target = Number(e.target.value);

                      setPageNumber(target >= 1 ? target : 1);
                    }}
                    max={$numPages}
                    min={1}
                    defaultValue={1}
                  />
                  of {$numPages}
                </Typography>
              </div>
            </div>
          )}

          {type == "code" && (
            <SyntaxHighlighter
              showLineNumbers={true}
              customStyle={{
                background: "rgb(255, 255, 255, 1)",
                minWidth: "50vw",
              }}
            >
              {$fileText}
            </SyntaxHighlighter>
          )}

          {type == "zip" && (
            <>
              <FolderZip
                sx={{
                  width: "256px",
                  height: "256px",
                  alignSelf: "center",
                  fill: "#ffffff",
                }}
              />

              <Button
                onClick={downloadFile}
                variant="contained"
                sx={{ color: "white" }}
              >
                Download
              </Button>
            </>
          )}

          {type == "executable" && (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                className="w-[256px] h-[256px] align-center"
              >
                <path
                  fill="#ffffff"
                  d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8zm.5 16.9L12 17.5L9.5 19l.7-2.8L8 14.3l2.9-.2l1.1-2.7l1.1 2.6l2.9.2l-2.2 1.9zM13 9V3.5L18.5 9z"
                />
              </svg>

              <Button
                onClick={downloadFile}
                variant="contained"
                sx={{ color: "white" }}
              >
                Download
              </Button>
            </>
          )}

          {type == "font" && (
            <TextFields
              sx={{
                width: "48px",
                height: "48px",
                alignSelf: "center",
                fill: "#00afef",
              }}
            />
          )}

          {type == "other" && (
            <Typography
              sx={{
                whiteSpace: "pre-wrap",
                minWidth: "50vw",
                color: "white",
              }}
            >
              {$fileText}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

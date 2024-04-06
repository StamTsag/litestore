import {
  folders,
  files,
  selectedFolder,
  selectedFile,
  isLoadingFiles,
  currentFolderId,
  sideOption,
  SideOption,
} from "@/app/stores";
import { NoteOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useReadable, useWritable } from "react-use-svelte-store";
import FileItem from "./FileItem";
import FolderItem from "./FolderItem";
import Loading from "../global/Loading";

export default function ContentView() {
  const $folders = useReadable(folders);
  const $files = useReadable(files);
  const $isLoadingFiles = useReadable(isLoadingFiles);

  const [_, setSelectedFolder] = useWritable(selectedFolder);
  const [__, setSelectedFile] = useWritable(selectedFile);
  const $currentFolderId = useReadable(currentFolderId);
  const $sideOption = useReadable(sideOption);

  function resetSelection() {
    // @ts-ignore
    setSelectedFolder(undefined);

    // @ts-ignore
    setSelectedFile(undefined);
  }

  return (
    <>
      {!$isLoadingFiles && ($folders.length > 0 || $files.length > 0) && (
        <div
          onClick={resetSelection}
          className="flex flex-col flex-1 select-none h-[93vh] overflow-x-hidden overflow-y-auto"
        >
          {$folders.length > 0 && !$currentFolderId && (
            <>
              <div className="flex flex-wrap mt-2">
                {$folders.map((folder) => {
                  return <FolderItem folder={folder} />;
                })}
              </div>
            </>
          )}

          {$files.length > 0 && (
            <div className="flex flex-wrap">
              <>
                {$files.map((file) => {
                  return <FileItem {...file} />;
                })}
              </>
            </div>
          )}
        </div>
      )}

      {((!$isLoadingFiles && $folders.length == 0) ||
        ($files.length == 0 && $currentFolderId)) && (
        <div className="fixed top-0 right-0 left-0 bottom-0 w-max m-auto flex flex-col items-center justify-center select-none">
          <NoteOutlined
            sx={{
              width: 100,
              height: 100,
              fill: "#00afef",
            }}
          />
          <Typography
            sx={{
              fontSize: {
                xs: "0.7rem",
                sm: "0.7rem",
                md: "0.9rem",
              },
              fontWeight: 800,
              textAlign: "center",
              color: "#00a0ef",
              textTransform: "uppercase",
            }}
          >
            {$sideOption == SideOption.Home && !$currentFolderId
              ? "Start by creating a new folder"
              : "Empty folder"}
          </Typography>
        </div>
      )}

      {$isLoadingFiles && <Loading />}
    </>
  );
}

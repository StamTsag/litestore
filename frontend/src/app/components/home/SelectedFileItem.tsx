import { SelectedFile, isUploadingFiles, selectedFiles } from "@/app/stores";
import { formatBytes, getFileType } from "@/app/utils";
import {
  Code,
  Delete,
  FolderZip,
  Image,
  LibraryMusic,
  PictureAsPdf,
  TextFields,
  TextSnippet,
  VideoLibrary,
  VideoSettings,
} from "@mui/icons-material";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import { useReadable, useWritable } from "react-use-svelte-store";

export default function SelectedFileItem({
  id,
  filename,
  size,
  progress,
}: SelectedFile) {
  const fileType = getFileType(filename);
  const [$selectedFiles, setSelectedFiles] = useWritable(selectedFiles);
  const $isUploadingFiles = useReadable(isUploadingFiles);

  function removeFile() {
    if ($isUploadingFiles) return;

    setSelectedFiles($selectedFiles.filter((v) => v.id != id));
  }

  return (
    <div className="flex items-center p-2 h-[64px] max-h-[64px] overflow-hidden">
      {fileType == "image" && <Image />}

      {fileType == "audio" && <LibraryMusic />}

      {fileType == "video" && <VideoLibrary />}

      {fileType == "pdf" && <PictureAsPdf />}

      {fileType == "code" && <Code />}

      {fileType == "zip" && <FolderZip />}

      {fileType == "executable" && <VideoSettings />}

      {fileType == "font" && <TextFields />}

      {fileType == "other" && (
        <TextSnippet
          sx={{
            width: 26,
            height: 26,
          }}
        />
      )}

      <Typography
        sx={{
          fontSize: {
            xs: "0.8rem",
            sm: "0.8rem",
            md: "0.9rem",
          },

          marginLeft: 1,
          maxWidth: "65%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {filename}
      </Typography>

      <span className="flex-1" />

      <Typography
        sx={{
          marginRight: 2,
          fontSize: {
            xs: "0.8rem",
            sm: "0.8rem",
            md: "0.9rem",
          },
        }}
      >
        {formatBytes(size)}
      </Typography>

      <IconButton
        sx={{
          opacity: $isUploadingFiles ? 0 : 1,
          cursor: $isUploadingFiles ? "default" : "pointer",
        }}
        onClick={removeFile}
      >
        <Delete
          sx={{
            fill: "red",
          }}
        />
      </IconButton>

      {$isUploadingFiles && (
        <CircularProgress variant="determinate" value={progress} />
      )}
    </div>
  );
}

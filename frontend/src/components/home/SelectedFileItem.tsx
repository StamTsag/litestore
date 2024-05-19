import { SelectedFile, isUploadingFiles, selectedFiles } from "@/lib/stores";
import { formatBytes, getFileType } from "@/lib/utils";
import { useReadable, useWritable } from "react-use-svelte-store";
import { Button } from "../ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { Progress } from "../ui/progress";

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
    setSelectedFiles($selectedFiles.filter((v) => v.id != id));
  }

  return (
    <div className="flex items-center h-[54px] max-h-[54px] overflow-hidden">
      {fileType == "image" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="hsl(var(--folder))"
            d="M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m0 18h12v-8l-4 4l-2-2zM8 9a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2"
          />
        </svg>
      )}

      {fileType == "audio" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="hsl(var(--folder))"
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 11h-2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2c.4 0 .7.1 1 .3V11h3zm0-4V3.5L18.5 9z"
          />
        </svg>
      )}

      {fileType == "video" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="hsl(var(--folder))"
            d="M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m11 17v-6l-3 2.2V13H7v6h7v-2.2z"
          />
        </svg>
      )}

      {fileType == "pdf" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          className="min-w-[32px] w-[32px] min-h-[32px] h-[48px] align-center"
        >
          <path
            d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023c.479 0 .774-.242.774-.651c0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018c.817.006 1.349-.444 1.349-1.396c.006-.83-.479-1.268-1.255-1.268z"
            fill="hsl(var(--folder))"
          />
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319c.254.202.426.533.426.923c-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515c-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426c.415.308.675.799.675 1.504c0 .763-.279 1.29-.663 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z"
            fill="hsl(var(--folder))"
          />
        </svg>
      )}

      {fileType == "code" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          className="min-w-[32px] w-[32px] min-h-[32px] h-[48px] align-center"
        >
          <path
            fill="hsl(var(--folder))"
            d="M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m.12 13.5l3.74 3.74l1.42-1.41l-2.33-2.33l2.33-2.33l-1.42-1.41zm11.16 0l-3.74-3.74l-1.42 1.41l2.33 2.33l-2.33 2.33l1.42 1.41z"
          />
        </svg>
      )}

      {fileType == "zip" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="hsl(var(--folder))"
            d="M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m9.68 13a3.758 3.758 0 0 0-7-1A3.03 3.03 0 0 0 6 17a3 3 0 0 0 3 3h6.5a2.5 2.5 0 0 0 2.5-2.5c0-1.32-1.03-2.39-2.32-2.5"
          />
        </svg>
      )}

      {fileType == "executable" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          className="min-w-[32px] w-[32px] min-h-[32px] h-[48px] align-center"
        >
          <path
            fill="#00afef"
            d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8zm.5 16.9L12 17.5L9.5 19l.7-2.8L8 14.3l2.9-.2l1.1-2.7l1.1 2.6l2.9.2l-2.2 1.9zM13 9V3.5L18.5 9z"
          />
        </svg>
      )}

      {fileType == "font" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="hsl(var(--folder))"
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm1.8 18H14l-2-3.4l-2 3.4H8.2l2.9-4.5L8.2 11H10l2 3.4l2-3.4h1.8l-2.9 4.5zM13 9V3.5L18.5 9z"
          />
        </svg>
      )}

      {fileType == "other" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="hsl(var(--folder))"
            d="M4 4c0-1.11.89-2 2-2h8l6 6v12c0 .53-.21 1.04-.59 1.41c-.37.38-.88.59-1.41.59H6c-.53 0-1.04-.21-1.41-.59C4.21 21.04 4 20.53 4 20zm9-.5V9h5.5zM12 11l-1.26 2.75L8 15l2.74 1.26L12 19l1.25-2.74L16 15l-2.75-1.25z"
          />
        </svg>
      )}

      <h1 className="xs:text-[0.6rem] xs:max-w-[25%] ml-1 text-sm max-w-[55%] overflow-hidden whitespace-nowrap text-ellipsis">
        {filename}
      </h1>

      <span className="flex-1" />

      <h1 className="xs:text-xs mr-2 text-sm tracking-tighter">
        {formatBytes(size)}
      </h1>

      <Button
        className={`${$isUploadingFiles && "opacity-0"} ml-2`}
        onClick={removeFile}
        variant={"ghost"}
        size="icon"
      >
        <TrashIcon className="xs:min-w-[20px] xs:w-[20px] xs:min-h-[20px] xs:h-[20px] min-w-[24px] w-[24px] min-h-[24px] h-[24px]" />
      </Button>

      {$isUploadingFiles && (
        <Progress
          className="xs:min-w-[20px] xs:w-[20px] min-w-[24px] w-[24px]"
          value={progress}
        />
      )}
    </div>
  );
}

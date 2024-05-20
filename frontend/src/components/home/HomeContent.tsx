import {
  folders,
  files,
  selectedFolder,
  isLoadingFiles,
  currentFolderId,
  sideOption,
  SideOption,
} from "@/lib/stores";
import { useReadable, useWritable } from "react-use-svelte-store";
import Loading from "../global/Loading";
import { CardStackPlusIcon } from "@radix-ui/react-icons";
import FolderItem from "./FolderItem";
import FileItem from "./FileItem";

export default function HomeContent() {
  const $folders = useReadable(folders);
  const $files = useReadable(files);
  const $isLoadingFiles = useReadable(isLoadingFiles);

  const [_, setSelectedFolder] = useWritable(selectedFolder);
  const $currentFolderId = useReadable(currentFolderId);
  const $sideOption = useReadable(sideOption);

  function resetSelection() {
    // @ts-ignore
    setSelectedFolder(undefined);
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
              <div className="xs:w-screen flex flex-wrap mt-2">
                {$folders.map((folder) => {
                  return <FolderItem key={folder.folderId} folder={folder} />;
                })}
              </div>
            </>
          )}

          {$files.length > 0 && $currentFolderId && (
            <div className="flex flex-wrap">
              <>
                {$files.map((file) => {
                  return <FileItem key={file.fileId} {...file} />;
                })}
              </>
            </div>
          )}
        </div>
      )}

      {((!$isLoadingFiles && $folders.length == 0) ||
        ($files.length == 0 && $currentFolderId)) && (
        <div className="fixed top-0 right-0 left-0 bottom-0 w-max m-auto flex flex-col items-center justify-center select-none">
          <CardStackPlusIcon className="xs:w-[100px] xs:min-w-[100px] xs:h-[100px] xs:min-h-[100px] min-w-[128px] w-[128px] min-h-[128px] h-[128px]" />
          <h1 className="xs:text-sm font-bold uppercase text-center text-md">
            {$sideOption == SideOption.Home && !$currentFolderId
              ? "Start by creating a new folder"
              : "Empty folder"}
          </h1>
        </div>
      )}

      {$isLoadingFiles && <Loading />}
    </>
  );
}

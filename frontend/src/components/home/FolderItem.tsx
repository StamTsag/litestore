import {
  File,
  Folder,
  currentFolderId,
  deletingFolder,
  files,
  folderCache,
  folders,
  isLoadingFiles,
  renamingFolder,
  selectedFolder,
  targetFolder,
} from "@/lib/stores";
import { useWritable } from "react-use-svelte-store";
import Cookies from "js-cookie";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

export default function FolderItem(props: any) {
  const [_, setTargetFolder] = useWritable(targetFolder);
  const [$selectedFolder, setSelectedFolder] = useWritable(selectedFolder);
  const [__, setFiles] = useWritable(files);
  const [___, setIsLoadingFiles] = useWritable(isLoadingFiles);
  const [____, setCurrentFolderId] = useWritable(currentFolderId);
  const [$folderCache, setFolderCache] = useWritable(folderCache);
  const [_____, setRenamingFolder] = useWritable(renamingFolder);
  const [______, setDeletingFolder] = useWritable(deletingFolder);

  const folder: Folder = props.folder;

  function setFolder() {
    setTargetFolder(folder);
  }

  function updateSelectedFolder() {
    setTimeout(() => {
      setSelectedFolder(folder);
    }, 0);
  }

  async function openFolder() {
    setIsLoadingFiles(true);

    setTimeout(() => {
      // @ts-ignore
      setSelectedFolder(undefined);
    }, 0);

    let folderFound = false;

    for (const folderIndex in $folderCache) {
      const target = $folderCache[folderIndex];
      const folderId = Object.keys(target)[0];
      const files = target[folderId];

      if (folderId == folder.folderId) {
        setFiles(files);

        folderFound = true;

        break;
      }
    }

    if (!folderFound) {
      const files = (await (
        await (
          await fetch(`api/files/${folder.folderId}`, {
            headers: {
              Authorization: Cookies.get("accessToken") as string,
            },
          })
        ).json()
      ).files) as File[];

      const newCache = $folderCache;

      const newDict: { [key: string]: File[] } = {};
      newDict[folder.folderId] = files;

      newCache.push(newDict);

      setFolderCache(newCache);

      setFiles(files);
    }

    setIsLoadingFiles(false);

    setCurrentFolderId(folder.folderId);
  }

  return (
    <div
      className={`xs:max-w-[80px] xs:w-[80px] flex flex-col flex-wrap items-center max-w-[100px] w-[100px] overflow-hidden m-2 mt-0 mb-0 select-none`}
      key={folder.folderId}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <svg
            onClick={updateSelectedFolder}
            onDoubleClick={openFolder}
            className={`hover:brightness-[108%] min-w-[76px] w-[76px] h-[76px] min-h-[76px] cursor-pointer`}
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="hsl(var(--folder))"
              d="M10 4H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8z"
            />
          </svg>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={openFolder}>Open folder</ContextMenuItem>

          <ContextMenuItem
            onClick={() => {
              setFolder();
              setRenamingFolder(true);
            }}
          >
            Rename
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem
            onClick={() => {
              setFolder();
              setDeletingFolder(true);
            }}
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <h1
        className={`${
          $selectedFolder == folder &&
          "bg-[hsl(var(--folder))] pr-1.5 pl-1.5 text-white"
        } text-sm font-medium text-center rounded-[10px] pr-1 pl-1 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap mb-4 translate-y-[-5px]`}
      >
        {folder.title}
      </h1>
    </div>
  );
}

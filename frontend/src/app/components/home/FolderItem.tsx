import {
  File,
  Folder,
  currentFolderId,
  files,
  folderCache,
  folders,
  isLoadingFiles,
  selectedFolder,
} from "@/app/stores";
import {
  Check,
  Delete,
  Folder as FolderIcon,
  FormatItalicOutlined,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { useWritable } from "react-use-svelte-store";
import Cookies from "js-cookie";

const TextFieldStyled = styled(TextField)({
  marginTop: 6,
});

export default function FolderItem(props: any) {
  const [$selectedFolder, setSelectedFolder] = useWritable(selectedFolder);
  const [$folders, setFolders] = useWritable(folders);
  const [_, setFiles] = useWritable(files);
  const [__, setIsLoadingFiles] = useWritable(isLoadingFiles);
  const [___, setCurrentFolderId] = useWritable(currentFolderId);
  const [$renamingFolder, setRenamingFolder] = useState(false);
  const [folderError, setFolderError] = useState("");
  const [$deletingFolder, setDeletingFolder] = useState(false);
  const [isProgressing, setIsProgressing] = useState(false);
  const [$folderCache, setFolderCache] = useWritable(folderCache);

  const folder: Folder = props.folder;

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
              Authorization: Cookies.get("litestore_token") as string,
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

  const handleRenameFolder = () => {
    handleClose();

    setRenamingFolder(true);
    setTimeout(() => {
      (document.getElementById("folder-title") as HTMLInputElement)?.focus();
    }, 0);
  };

  const handleCloseRenameFolder = () => {
    setRenamingFolder(false);

    setTimeout(() => {
      setFolderError("");
    }, 250);
  };

  async function renameFolder() {
    if (isProgressing) return;

    const element = document.getElementById("folder-title") as HTMLInputElement;

    const title = element.value.trim() as string;

    if (title.length == 0) {
      handleCloseRenameFolder();

      return;
    }

    setIsProgressing(true);

    const res = await fetch(`api/folders/rename/${folder.folderId}`, {
      method: "POST",
      body: JSON.stringify({
        title,
      }),
      headers: {
        Authorization: Cookies.get("litestore_token") as string,
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

      handleCloseRenameFolder();
    } else {
      // @ts-ignore
      setFolderError(resJson.failure);
    }

    setIsProgressing(false);
  }

  const handleDeleteFolder = () => {
    handleClose();

    setDeletingFolder(true);
  };

  const handleCloseDeleteFolder = () => {
    setDeletingFolder(false);
  };

  async function deleteFolder() {
    if (isProgressing) return;

    setIsProgressing(true);

    const res = await fetch(`api/folders/${folder.folderId}`, {
      method: "DELETE",
      headers: {
        Authorization: Cookies.get("litestore_token") as string,
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

    handleCloseDeleteFolder();

    setIsProgressing(false);
  }

  return (
    <div
      className={`flex flex-col flex-wrap items-center max-w-[100px] w-[100px] overflow-hidden m-2 mt-0 mb-0 select-none`}
      key={folder.folderId}
      onContextMenu={() => {}}
    >
      <IconButton
        sx={{
          width: 76,
          height: 76,
          paddingRight: 1.5,
          paddingLeft: 1.5,
          ":hover": {
            background: "transparent",
          },
        }}
        onClick={() => updateSelectedFolder()}
      >
        <FolderIcon
          sx={{
            width: 76,
            height: 76,
            fill: $selectedFolder == folder ? "#00a0ef" : "#00afef",
            ":hover": {
              fill: $selectedFolder == folder ? "#00a0ef" : "#00bfef",
            },
            transition: "none",
          }}
          onContextMenu={handleContextMenu}
          onDoubleClick={openFolder}
        />
      </IconButton>

      <Typography
        sx={{
          fontSize: {
            xs: "0.8rem",
            sm: "0.8rem",
            md: "0.9rem",
          },
          fontWeight: 400,
          textAlign: "center",
          background: $selectedFolder == folder ? "#00a0ef" : "transparent",
          color: $selectedFolder == folder ? "white" : "black",
          borderRadius: 3,
          paddingRight: 0.75,
          paddingLeft: 0.75,
          maxWidth: "100px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {folder.title}
      </Typography>

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
        <MenuItem onClick={openFolder}>
          <Typography
            sx={{
              width: 125,
            }}
          >
            Open
          </Typography>

          <FolderIcon
            sx={{
              marginLeft: 5,
            }}
          />
        </MenuItem>

        <Divider />
        {/* 
        <MenuItem onClick={handleClose}>
          <Typography
            sx={{
              width: 125,
            }}
          >
            Star
          </Typography>

          <Star
            sx={{
              marginLeft: 5,
            }}
          />
        </MenuItem> */}

        {/* 
        <Divider />

        <MenuItem onClick={handleClose}>
          <Typography
            sx={{
              width: 125,
            }}
          >
            Share
          </Typography>

          <FolderShared
            sx={{
              marginLeft: 5,
            }}
          />
        </MenuItem>

        <Divider /> */}

        <MenuItem onClick={handleRenameFolder}>
          <Typography
            sx={{
              width: 125,
            }}
          >
            Rename
          </Typography>

          <FormatItalicOutlined
            sx={{
              marginLeft: 5,
            }}
          />
        </MenuItem>

        <Divider />

        {/* <MenuItem onClick={handleClose}>
          <Typography
            sx={{
              width: 125,
            }}
          >
            Move to Trash
          </Typography>

          <RecyclingOutlined
            sx={{
              marginLeft: 5,
            }}
          />
        </MenuItem> */}

        <MenuItem onClick={handleDeleteFolder}>
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
        open={$renamingFolder}
        onClose={handleCloseRenameFolder}
        PaperProps={{
          component: "form",
          onSubmit: (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            handleRenameFolder();
          },
        }}
      >
        <DialogTitle>Rename Folder</DialogTitle>
        <DialogContent>
          <TextFieldStyled
            autoFocus
            label="New folder name"
            fullWidth
            variant="outlined"
            inputProps={{
              id: "folder-title",
              maxLength: 30,
            }}
            error={folderError.length > 0}
            helperText={folderError}
            defaultValue={folder.title}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRenameFolder}>Cancel</Button>
          <Button
            variant="contained"
            sx={{
              color: "white",
            }}
            type="submit"
            onClick={renameFolder}
          >
            <Check sx={{ marginRight: 1 }} />
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth={true}
        maxWidth="xs"
        open={$deletingFolder}
        onClose={handleCloseDeleteFolder}
        PaperProps={{
          component: "form",
          onSubmit: (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            handleDeleteFolder();
          },
        }}
      >
        <DialogTitle>Delete {folder.title}</DialogTitle>
        <DialogContentText
          sx={{
            marginLeft: 3,
          }}
        >
          Deleting a folder permanently can't be reversed
        </DialogContentText>

        <Divider sx={{ marginTop: 4 }} />

        <DialogActions>
          <Button onClick={handleCloseDeleteFolder}>Cancel</Button>
          <Button
            variant="contained"
            sx={{
              color: "white",
              paddingLeft: 1.5,
            }}
            type="submit"
            onClick={deleteFolder}
          >
            <Delete sx={{ marginRight: 1, marginBottom: 0.01 }} />
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

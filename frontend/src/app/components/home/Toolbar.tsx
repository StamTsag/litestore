"use client";

import { currentFolderId, files, userData } from "@/app/stores";
import { formatBytes } from "@/app/utils";
import {
  MeetingRoom,
  NoAccounts,
  PieChart,
  SupervisedUserCircle,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Dialog,
  Divider,
  Button,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  Tooltip,
  Typography,
  alpha,
  styled,
  DialogActions,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useReadable, useWritable } from "react-use-svelte-store";

const TextFieldStyled = styled(TextField)({
  marginTop: 6,
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#00afef",
    color: "#00afef",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "100%",
      border: "1px solid currentColor",
      content: '""',
    },
  },
}));

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 10,
    marginTop: theme.spacing(0.5),
    minWidth: 180,
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.025) 0px 0px 0px 1px, rgba(0, 0, 0, 0.075) 0px 10px 15px -3px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function Toolbar() {
  const router = useRouter();
  const $userData = useReadable(userData);
  const [_, setFiles] = useWritable(files);
  const [__, setCurrentFolderId] = useWritable(currentFolderId);
  const [$viewingUsage, setViewingUsage] = useState(false);
  const [$usageLoaded, setUsageLoaded] = useState(false);
  const [$totalUsage, setTotalUsage] = useState(0);
  const [$usagePercentage, setUsagePercentage] = useState(0);
  const [$terminating, setTerminating] = useState(false);
  const [$terminatingError, setTerminatingError] = useState("");
  const [$terminatingLoading, setTerminatingLoading] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  function handleRoot() {
    router.replace("/home");

    setFiles([]);

    // @ts-ignore
    setCurrentFolderId(undefined);
  }

  const handleShowUsage = async () => {
    closeMenu();

    setViewingUsage(true);

    const res = await fetch("api/usage", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: localStorage.getItem("token") as string,
      },
    });

    const resJson = await res.json();

    setTotalUsage(resJson.totalUsage as number);

    setUsagePercentage(Math.round((resJson.totalUsage / 500000000) * 100));

    setUsageLoaded(true);
  };

  const handleCloseUsage = () => {
    setViewingUsage(false);

    setTimeout(() => {
      setTotalUsage(0);
      setUsagePercentage(0);
      setUsageLoaded(false);
    }, 500);
  };

  const handleShowTerminating = async () => {
    closeMenu();

    setTerminating(true);
  };

  const handleCloseTerminating = () => {
    setTerminating(false);

    setTimeout(() => {
      setTerminatingError("");
    }, 250);
  };

  async function terminate() {
    if ($terminatingLoading) return;

    const element = document.getElementById(
      "terminate-password"
    ) as HTMLInputElement;

    const password = element.value.trim() as string;

    if (password.length == 0) {
      return;
    }

    setTerminatingLoading(true);

    const res = await fetch("api/login", {
      method: "DELETE",
      body: JSON.stringify({
        password,
        token: localStorage.getItem("token"),
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    if (res.status != 200) {
      const resJson = await res.json();

      setTerminatingError(resJson.failure);
    } else {
      localStorage.clear();

      location.href = "/";
    }
  }

  function logout() {
    localStorage.clear();

    // Don't use router, reset all states with this
    location.href = "/auth";
  }

  return (
    <div className="mobile:p-0 mobile:pl-2 mobile:pr-2 mobile:justify-center bg-transparent flex items-center m-auto border-b backdrop-blur-lg p-2 select-none">
      <img
        onClick={handleRoot}
        src="/litestore.svg"
        className="min-w-[48px] w-[48px] min-h-[48px] h-[48[x] hover:animate-twirl cursor-pointer"
        draggable={false}
      />

      <Typography fontWeight={400} variant="h6" ml={1}>
        Litestore
      </Typography>

      <span className="flex-1" />

      <Tooltip title="Account settings">
        <IconButton onClick={openMenu}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              alt={$userData.username}
              src={$userData.avatar || "/icon"}
              sx={{ bgcolor: "#00afef" }}
            />
          </StyledBadge>
        </IconButton>
      </Tooltip>

      <StyledMenu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={menuAnchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        <MenuItem onClick={closeMenu}>
          <SupervisedUserCircle />
          {$userData?.username}
        </MenuItem>

        <Divider sx={{ opacity: 0.5 }} />

        <MenuItem onClick={handleShowUsage}>
          <PieChart />
          Data usage
        </MenuItem>

        <Divider sx={{ opacity: 0.5 }} />

        <MenuItem onClick={handleShowTerminating}>
          <NoAccounts />
          Terminate
        </MenuItem>

        <Divider sx={{ opacity: 0.5 }} />

        <MenuItem onClick={logout}>
          <MeetingRoom />
          Logout
        </MenuItem>
      </StyledMenu>

      <Dialog
        fullWidth={true}
        maxWidth="xs"
        open={$viewingUsage}
        onClose={handleCloseUsage}
      >
        <DialogTitle>Data Usage</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <CircularProgress
            size={128}
            variant="determinate"
            value={$usagePercentage}
            thickness={2}
          />

          <Typography
            sx={{
              paddingTop: 4,
            }}
          >
            {$usageLoaded
              ? `${formatBytes($totalUsage)} / 500MB (${$usagePercentage}%)`
              : "Calculating usage..."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUsage}>Dismiss</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth={true}
        maxWidth="xs"
        open={$terminating}
        onClose={handleCloseTerminating}
        PaperProps={{
          component: "form",
          onSubmit: (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            handleShowTerminating();
          },
        }}
      >
        <DialogTitle>Delete account</DialogTitle>
        <DialogContent>
          <TextFieldStyled
            autoFocus
            label="Password"
            fullWidth
            type="password"
            variant="outlined"
            inputProps={{
              id: "terminate-password",
            }}
            error={$terminatingError.length > 0}
            helperText={$terminatingError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTerminating}>Cancel</Button>
          <Button
            variant="contained"
            sx={{
              color: "white",
            }}
            type="submit"
            onClick={terminate}
            disabled={$terminatingLoading}
          >
            <NoAccounts sx={{ marginRight: 1 }} />
            Terminate
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

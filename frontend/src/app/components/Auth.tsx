"use client";

import { AlternateEmail, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  inputLabelClasses,
  styled,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ToggleButtonStyled = styled(ToggleButton)({
  width: 250,
  color: "white",
  background: "rgb(255, 255, 255, 0.01)",
  fontSize: "1.3rem",
  textTransform: "none",
  borderEndEndRadius: 0,
  borderEndStartRadius: 0,
  "&:hover": {
    background: "rgb(255, 255, 255, 0.03)",
  },
  transition: "150ms",
  flexGrow: 1,
});

const TextFieldStyled = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },

    "&:hover fieldset": {
      borderColor: "white",
    },

    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },

  "& .MuiInputBase-input": {
    width: "100%",
    color: "white",
    fontWeight: 600,
  },

  "& label": {
    color: "white",
    fontWeight: 600,
  },

  "& input": {
    color: "#fff !important",
    "-webkit-text-fill-color": "#fff !important",
    "-webkit-background-clip": "text !important",
    "background-clip": "text !important",
    fontSize: "1rem",
  },

  "& input:-webkit-autofill": {
    background: "transparent",
  },

  "& .MuiInput-underline:before": { borderBottomColor: "white" },
  "& .MuiInput-underline:hover:before": {
    borderBottomColor: "white",
  },
  "& .MuiInput-underline:hover:after": {
    borderBottomColor: "white",
  },
  "& .MuiInput-underline:after": { borderBottomColor: "white" },

  width: "95%",
  marginBottom: 30,
  alignSelf: "center",
});

const ButtonContent = styled(Button)({
  color: "white",
  marginTop: 20,
  textTransform: "none",
  width: "100%",
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  padding: 10,
});

export default function Auth() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("register");
  const [visibility, setVisibility] = useState(false);

  function handleType(ev: React.MouseEvent<HTMLElement>, val: string) {
    if (!val) return;

    setType(val);

    setError("");
  }

  function handleVisibility() {
    setVisibility(!visibility);
  }

  async function register() {
    // Data validation
    if (!identifier || !email || !password) return;

    const res = await (
      await fetch("api/register", {
        method: "POST",
        body: JSON.stringify({
          identifier,
          email,
          password,
        }),
        headers: {
          "content-type": "application/json",
        },
      })
    ).json();

    if (res.failure || res.errors) {
      setError(res.failure || res.errors[0].message);
    } else {
      // TODO: JWT
      localStorage.setItem("token", res.token);

      router.push("/home");
    }
  }

  async function login() {
    // Data validation
    if (!email || !password) return;

    const res = await (
      await fetch("api/login", {
        method: "POST",
        body: JSON.stringify({
          identifier,
          email,
          password,
        }),
        headers: {
          "content-type": "application/json",
        },
      })
    ).json();

    if (res.failure || res.errors) {
      setError(res.failure || res.errors[0].message);
    } else {
      // TODO: JWT
      localStorage.setItem("token", res.token);

      router.push("/home");
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.replace("/home");
    }
  });

  return (
    <div
      className={`mobile:w-[90%]  bg-[#ffffff0d] rounded w-[500px] max-w-[500px] fixed flex flex-col items-center justify-center top-0 right-0 left-0 bottom-0 w-max m-auto h-max select-none`}
    >
      <ToggleButtonGroup
        className="w-full"
        color="primary"
        exclusive
        value={type}
        onChange={handleType}
      >
        <ToggleButtonStyled
          sx={{
            fontSize: {
              xs: "1.1rem",
              sm: "1.1rem",
              md: "1.3rem",
            },
          }}
          value="register"
        >
          Register
        </ToggleButtonStyled>
        <ToggleButtonStyled
          sx={{
            fontSize: {
              xs: "1.1rem",
              sm: "1.1rem",
              md: "1.3rem",
            },
          }}
          value="login"
        >
          Login
        </ToggleButtonStyled>
      </ToggleButtonGroup>

      <div className="flex flex-col w-full h-[400px] p-6 pt-0">
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: {
              xs: "1rem",
              sm: "1rem",
              md: "1.2rem",
            },
          }}
          className={`text-center text-[#ff0000] ${
            error ? "visible" : "invisible"
          } mb-4 pt-2 pb-4`}
        >
          {error}
        </Typography>

        {type == "register" && (
          <TextFieldStyled
            onChange={(ev) => setIdentifier(ev.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmail htmlColor="white" />
                </InputAdornment>
              ),

              sx: {
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.8rem",
                  md: "1rem",
                },
              },
            }}
            InputLabelProps={{
              sx: {
                color: "white",
                [`&.${inputLabelClasses.shrink}`]: {
                  color: "white",
                },

                fontSize: {
                  xs: "0.8rem",
                  sm: "0.8rem",
                  md: "1rem",
                },
              },
            }}
            variant="outlined"
            label="Identifier"
          />
        )}

        <TextFieldStyled
          onChange={(ev) => setEmail(ev.target.value)}
          InputLabelProps={{
            sx: {
              color: "white",
              [`&.${inputLabelClasses.shrink}`]: {
                color: "white",
              },
            },
          }}
          variant="outlined"
          label="Email address"
        />

        <TextFieldStyled
          onChange={(ev) => setPassword(ev.target.value)}
          type={visibility ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onMouseDown={handleVisibility}>
                  {visibility ? (
                    <Visibility htmlColor="white" />
                  ) : (
                    <VisibilityOff htmlColor="white" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            sx: {
              color: "white",
              [`&.${inputLabelClasses.shrink}`]: {
                color: "white",
              },
            },
          }}
          variant="outlined"
          label="Password"
        />
      </div>

      <ButtonContent
        onClick={() => (type == "register" ? register() : login())}
        sx={{
          fontSize: {
            xs: "1rem",
            sm: "1rem",
            md: "1.2rem",
          },
        }}
        variant="contained"
      >
        Authenticate
      </ButtonContent>
    </div>
  );
}

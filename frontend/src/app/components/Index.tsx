"use client";

import { Button, Typography, styled } from "@mui/material";
import Link from "next/link";
import { useWritable } from "react-use-svelte-store";
import { hasToken } from "../stores";
import { useEffect } from "react";
import Cookies from "js-cookie";

const TextContentStyled = styled(Typography)({
  background: `-webkit-linear-gradient(
            200deg,
            #ffffff,
            #7bd0f5,
            #ffffff,
            #7bd0f5,
            #ffffff
        );`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: "600",
  padding: "2px",
  marginBottom: 20,
  textAlign: "center",
});

const TextContent = styled(Typography)({
  color: "white",
  fontSize: "1.5rem",
  fontWeight: "500",
  textAlign: "center",
});

const ButtonContent = styled(Button)({
  color: "white",
  fontSize: "1.5rem",
  textTransform: "none",
  width: 200,
});

export default function Index() {
  const [$hasToken, setHasToken] = useWritable(hasToken);

  useEffect(() => {
    // @ts-ignore
    setHasToken(Cookies.get("litestore_token"));
  });

  return (
    <div className="fixed flex flex-col items-center justify-center top-0 right-0 left-0 bottom-0 w-screen m-auto h-max select-none">
      <TextContentStyled
        sx={{
          fontSize: {
            xs: "2rem",
            sm: "2rem",
            md: "2.7rem",
          },
        }}
        variant="h3"
      >
        Your own lite-weight file storage
      </TextContentStyled>

      <TextContent
        sx={{
          fontSize: {
            xs: "1.2rem",
            sm: "1.2rem",
            md: "1.5rem",
          },
        }}
        variant="h6"
      >
        Free from any tracking and advertising
      </TextContent>
      <TextContent
        sx={{
          fontSize: {
            xs: "1.2rem",
            sm: "1.2rem",
            md: "1.5rem",
          },

          marginBottom: "30px",
        }}
        variant="h6"
      >
        As simple as it gets
      </TextContent>

      <Link href={`/${$hasToken ? "home" : "auth"}`}>
        <ButtonContent
          sx={{
            fontSize: {
              xs: "1.2rem",
              sm: "1.2rem",
              md: "1.5rem",
            },
          }}
          variant="contained"
        >
          {$hasToken ? "Go to home" : "Try it out"}
        </ButtonContent>
      </Link>
    </div>
  );
}

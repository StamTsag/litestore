"use client";

import { Button, Typography, styled } from "@mui/material";
import Link from "next/link";

const TextContentStyled = styled(Typography)({
  background: `-webkit-linear-gradient(
            225deg,
            red,
            #ffffff,
            red,
            #ffffff,
            red
        );`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: "600",
  padding: "2px",
  marginBottom: 20,
});

const TextContent = styled(Typography)({
  color: "white",
  fontSize: "1.5rem",
  fontWeight: "500",
});

const ButtonContent = styled(Button)({
  color: "white",
  marginTop: 30,
  fontSize: "1.5rem",
  textTransform: "none",
  width: 150,
  background: "red",
  "&:hover": {
    background: "rgb(200, 0, 0)",
  },
});

export default function NotFound() {
  return (
    <div className="fixed flex flex-col items-center justify-center top-0 right-0 left-0 bottom-0 w-screen m-auto h-max select-none">
      <TextContentStyled
        sx={{
          fontSize: {
            xs: "1.8rem",
            sm: "1.8rem",
            md: "2.7rem",
          },
        }}
        variant="h3"
      >
        An oopsie occured (404)
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
        How did you end up here?
      </TextContent>

      <Link href="/">
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
          Go back
        </ButtonContent>
      </Link>
    </div>
  );
}

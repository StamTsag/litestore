"use client";

import { Typography, styled } from "@mui/material";

const FooterText = styled(Typography)({
  fontWeight: 700,
  color: "white",
});

export default function Footer() {
  return (
    <div className="mobile:w-screen mobile:rounded-none flex items-center justify-center fixed right-0 bottom-0 left-0 w-[50%] m-auto rounded backdrop-blur-lg shadow-bg-white p-2 select-none">
      <FooterText
        sx={{
          fontSize: {
            xs: "0.7rem",
            sm: "0.7rem",
            md: "0.9rem",
          },
        }}
        variant="h6"
        ml={1}
      >
        © Copyright 2024
      </FooterText>
    </div>
  );
}

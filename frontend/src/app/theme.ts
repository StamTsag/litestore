"use client";

import { createTheme } from "@mui/material";
import { Manrope } from "next/font/google";

const font = Manrope({ subsets: ["latin"] });

export default createTheme({
  typography: {
    fontFamily: font.style.fontFamily,
  },

  palette: {
    primary: {
      light: "#7bd0f5",
      main: "#00afef",
      dark: "#0081ca",
    },

    secondary: {
      light: "#ff4d0c",
      main: "#ef4000",
      dark: "#c92700",
    },
  },
});

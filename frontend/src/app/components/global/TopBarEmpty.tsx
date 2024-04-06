"use client";

import { Typography } from "@mui/material";
import Link from "next/link";

export default function TopBarEmpty() {
  return (
    <div className="mobile:justify-center mobile:w-screen mobile:rounded-none flex items-center fixed top-0 right-0 left-0 w-[50%] m-auto rounded shadow-bg-white backdrop-blur-lg p-2 select-none">
      <Link href="/">
        <img
          src="/litestore.svg"
          className="w-[48px] h-[48[x]"
          draggable={false}
        />
      </Link>
      <Typography color={"white"} fontWeight={600} variant="h6" ml={1}>
        Litestore
      </Typography>
    </div>
  );
}

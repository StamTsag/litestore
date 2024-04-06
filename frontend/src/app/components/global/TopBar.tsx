"use client";

import { Button, Typography, styled } from "@mui/material";
import Link from "next/link";

const BarButton = styled(Button)({
  marginLeft: 5,
  marginRight: 5,
});

export default function TopBar() {
  return (
    <div className="mobile:w-screen mobile:rounded-none flex items-center fixed top-0 right-0 left-0 w-[50%] m-auto rounded shadow-bg-white backdrop-blur-lg p-2 select-none">
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

      <span className="flex-1"></span>

      {!localStorage.getItem("token") && (
        <Link href="/auth">
          <BarButton variant="outlined">Try it out</BarButton>
        </Link>
      )}
    </div>
  );
}

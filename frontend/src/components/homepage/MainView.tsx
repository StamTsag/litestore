"use client";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function MainView() {
  const [hasJWT, setHasJWT] = useState(false);

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      setHasJWT(true);
    }
  }, []);

  return (
    <div className="h-[100vh] w-full flex flex-col items-center justify-center text-center">
      <h1 className="xs:text-[1.7rem] font-extrabold text-5xl tracking-tighter pb-3">
        Lite-weight cloud-based file storage.
      </h1>

      <h1 className="xs:text-sm xs:w-[90%] w-[500px] text-lg">
        Your personal online filesystem. No spying no bloatware. 24/7
        availability. Lite but instantaneous. Try it.
      </h1>

      <div className="flex items-center mt-7">
        <Link href={`${hasJWT ? "/home" : "/auth"}`}>
          <Button className="xs:text-sm mr-2 font-semibold text-md" size="lg">
            {hasJWT ? "Go to storage" : "Get your own"}
          </Button>
        </Link>

        <Link href="https://github.com/Shadofer/litestore" target="_blank">
          <Button
            variant={"outline"}
            size="lg"
            className="xs:text-sm ml-2 font-semibold text-md"
          >
            <GitHubLogoIcon className="xs:text-sm mr-2 w-[20px] h-[20px]" />
            View on Github
          </Button>
        </Link>
      </div>
    </div>
  );
}

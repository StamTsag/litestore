"use client";

import Home from "../components/Home";
import { useWritable } from "react-use-svelte-store";
import {
  Folder,
  UserData,
  authenticated,
  folders,
  isMobile,
  userData,
} from "../stores";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Toolbar from "../components/home/Toolbar";
import Loading from "../components/global/Loading";
import Cookies from "js-cookie";

export default function RouteHome() {
  let effectRan = false;
  const router = useRouter();

  const [$authenticated, setAuthenticated] = useWritable(authenticated);
  const [_, setUserData] = useWritable(userData);
  const [__, setFolders] = useWritable(folders);
  const [___, setIsMobile] = useWritable(isMobile);

  async function fetchUserData() {
    // Get self data
    const userData = (
      await (
        await fetch("api/me", {
          headers: {
            Authorization: Cookies.get("litestore_token") as string,
          },
        })
      ).json()
    ).profileData as UserData;

    // Invalid token, re-auth
    if (!userData) {
      Cookies.remove("litestore_token");

      router.replace("/auth");

      return;
    }

    return { ...userData };
  }

  async function fetchHome(): Promise<{ folders: Folder[] }> {
    // Get home folders
    const folders = (
      await (
        await fetch(`api/folders`, {
          headers: {
            Authorization: Cookies.get("litestore_token") as string,
          },
        })
      ).json()
    ).folders as Folder[];

    return { folders };
  }

  useEffect(() => {
    if (effectRan) return;

    effectRan = true;

    const userAgent = window.navigator.userAgent.toLowerCase();

    setIsMobile(userAgent.includes("android") || userAgent.includes("iphone"));

    // No token, auth
    if (!Cookies.get("litestore_token")) {
      router.replace("/auth");
      return;
    }

    fetchUserData().then((data) => {
      if (!data) return;

      setUserData({ ...(data as UserData) });

      fetchHome().then(({ folders }) => {
        setFolders(folders);

        setAuthenticated(true);
      });
    });
  }, []);

  return (
    <div className="bg-white w-screen h-screen">
      {$authenticated ? (
        <>
          <Toolbar />

          <Home />
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}

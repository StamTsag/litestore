"use client";

import { useWritable } from "react-use-svelte-store";
import {
  Folder,
  UserData,
  authenticated,
  folders,
  userData,
} from "@/lib/stores";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import HomeView from "@/components/home/HomeView";
import TopNav from "@/components/global/TopNav";
import Loading from "@/components/global/Loading";
import Head from "next/head";
import Dialogs from "@/components/home/Dialogs";

export default function RouteHome() {
  let effectRan = false;
  const router = useRouter();

  const [$authenticated, setAuthenticated] = useWritable(authenticated);
  const [_, setUserData] = useWritable(userData);
  const [__, setFolders] = useWritable(folders);

  async function regenerateAccessToken() {
    const res = await fetch("api/accessToken", {
      headers: {
        Authorization: Cookies.get("refreshToken") as string,
      },
    });

    if (res.status != 200) {
      Cookies.remove("refreshToken");
      Cookies.remove("accessToken");

      router.replace("/auth");

      return;
    }

    Cookies.set(
      "accessToken",
      `Bearer ${(await res.json()).accessToken as string}`,
      {
        expires: new Date(new Date().getTime() + 60 * 60 * 1000),
      }
    );
  }

  async function fetchUserData() {
    // Get self data
    const userData = (
      await (
        await fetch("api/me", {
          headers: {
            Authorization: Cookies.get("accessToken") as string,
          },
        })
      ).json()
    ).profileData as UserData;

    // Invalid token, re-auth
    if (!userData) {
      Cookies.remove("accessToken");

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
            Authorization: Cookies.get("accessToken") as string,
          },
        })
      ).json()
    ).folders as Folder[];

    return { folders };
  }

  useEffect(() => {
    if (effectRan) return;

    effectRan = true;

    // No token, auth
    if (!Cookies.get("refreshToken")) {
      router.replace("/auth");
      return;
    }

    // Refresh token automatically
    const tokenInterval = setInterval(async () => {
      if (!Cookies.get("refreshToken")) {
        clearInterval(tokenInterval);
        return;
      }

      await regenerateAccessToken();
    }, 60 * 60 * 1000);

    regenerateAccessToken().then(() => {
      fetchUserData().then((data) => {
        if (!data) return;

        setUserData({ ...(data as UserData) });

        fetchHome().then(({ folders }) => {
          setFolders(folders);

          setAuthenticated(true);
        });
      });
    });
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Head>
        <title>Litestore | Home</title>
      </Head>

      {$authenticated ? (
        <>
          <TopNav notFixed forceShowSheet />

          <HomeView />

          <Dialogs />
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}

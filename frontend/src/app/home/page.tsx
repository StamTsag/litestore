"use client";

import Home from "../components/Home";
import { useWritable } from "react-use-svelte-store";
import { Folder, UserData, authenticated, folders, userData } from "../stores";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Toolbar from "../components/home/Toolbar";
import Loading from "../components/global/Loading";

export default function RouteHome() {
  let effectRan = false;
  const router = useRouter();

  const [$authenticated, setAuthenticated] = useWritable(authenticated);
  const [_, setUserData] = useWritable(userData);
  const [__, setFolders] = useWritable(folders);

  // TODO: JWT
  async function loginToken() {
    // No token, auth
    if (!localStorage.getItem("token")) {
      router.replace("/auth");
      return;
    }

    const res = await (
      await fetch("api/loginToken", {
        method: "POST",
        body: JSON.stringify({
          token: localStorage.getItem("token"),
        }),
        headers: {
          "content-type": "application/json",
        },
      })
    ).json();

    // Get self data
    const userData = (
      await (
        await fetch("api/me", {
          headers: {
            Authorization: localStorage.getItem("token") as string,
          },
        })
      ).json()
    ).profileData as UserData;

    // Invalid token, re-auth
    if (res.failure || res.errors || !userData) {
      localStorage.clear();

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
            Authorization: localStorage.getItem("token") as string,
          },
        })
      ).json()
    ).folders as Folder[];

    return { folders };
  }

  useEffect(() => {
    if (effectRan) return;

    effectRan = true;

    if (!localStorage.getItem("token")) {
      router.replace("/auth");
    }

    loginToken().then((data) => {
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

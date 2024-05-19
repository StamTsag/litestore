"use client";

import { Button } from "../ui/button";
import ThemeToggle from "./ThemeToggle";
import {
  ArrowRightIcon,
  CrossCircledIcon,
  FilePlusIcon,
  GitHubLogoIcon,
  HamburgerMenuIcon,
  HomeIcon,
  PlusIcon,
  TimerIcon,
} from "@radix-ui/react-icons";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  SideOption,
  authenticated,
  creatingFolder,
  currentFolderId,
  files,
  folders,
  sideOption,
  terminatingAccount,
  uploadingFiles,
  viewingUsage,
} from "@/lib/stores";
import { useWritable } from "react-use-svelte-store";
import { useRouter } from "next/navigation";

interface Props {
  isHomepage?: boolean;
  notFixed?: boolean;
  forceShowSheet?: boolean;
}
interface TopNavHeader {
  title: string;
  ref: string;
}

export default function TopNav({
  isHomepage = false,
  notFixed = false,
  forceShowSheet = false,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [hasJWT, setHasJWT] = useState(false);
  const [isInHome, setIsInHome] = useState(false);
  const [$currentFolderId, setCurrentFolderId] = useWritable(currentFolderId);
  const [_, setCreatingFolder] = useWritable(creatingFolder);
  const [__, setUploadingFiles] = useWritable(uploadingFiles);
  const [___, setViewingUsage] = useWritable(viewingUsage);
  const [____, setTerminatingAccount] = useWritable(terminatingAccount);
  const [$sideOption, setSideOption] = useWritable(sideOption);
  const [_____, setFiles] = useWritable(files);
  const [______, setFolders] = useWritable(folders);
  const [_______, setAuthenticated] = useWritable(authenticated);

  // TODO: Add again
  const headers: TopNavHeader[] = [];

  function scrollTop() {
    window.scrollTo({
      top: 0,
    });
  }

  const handleHome = () => {
    setSideOption(SideOption.Home);

    router.replace("/home");

    // @ts-ignore
    setCurrentFolderId(undefined);

    setFiles([]);
  };

  function logout() {
    Cookies.remove("refreshToken");
    Cookies.remove("accessToken");

    router.replace("/");

    setTimeout(() => {
      setAuthenticated(false);

      // @ts-ignore
      setCurrentFolderId(undefined);

      setFiles([]);
      setFolders([]);
    }, 250);
  }

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      setHasJWT(true);
    }

    setIsInHome(location.href.endsWith("/home"));
  }, []);

  return (
    <div
      className={`${
        !notFixed ? "fixed top-0 right-0 left-0" : ""
      } mobile:w-[100%] bg-background/70 backdrop-blur-md m-auto w-screen pr-0 pl-0 h-[64px] max-h-[64px] p-4 select-none`}
    >
      <div className="mobile:pl-4 mobile:pr-6 flex items-center pl-[15%] pr-[15%] mb-3">
        {(isHomepage || forceShowSheet) && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="xs:inline-flex hidden mr-3 min-w-[36px]"
              >
                <HamburgerMenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="min-w-[250px] w-[40%]">
              <SheetHeader>
                <SheetTitle asChild>
                  <div className="flex items-center">
                    {!isInHome && (
                      <>
                        <Link href="https://shadofer.com">
                          <img
                            src="/stamtsag.ico"
                            className="w-[28px] h-[28px] mr-2 cursor-pointer"
                          />
                        </Link>

                        <h1 className="font-black text-3xl mr-2">/</h1>
                      </>
                    )}

                    <img
                      onClick={scrollTop}
                      src="/favicon.ico"
                      className="w-[28px] h-[28px] mr-2 cursor-pointer"
                    />
                    <h1
                      onClick={scrollTop}
                      className="xs:text-lg tracking-tighter font-bold text-xl mr-6 translate-x-[-3px] font-black cursor-pointer"
                    >
                      Litestore
                    </h1>
                  </div>
                </SheetTitle>
                <SheetDescription>
                  <div className="flex flex-col ml-1">
                    {!isInHome ? (
                      <>
                        {headers.map(({ title, ref }) => {
                          return (
                            <div key={title} className="flex mt-2 mb-2">
                              <h1
                                onClick={() => {
                                  document
                                    .querySelector(`#${ref}`)
                                    ?.scrollIntoView({ block: "start" });

                                  setOpen(false);
                                }}
                                className="hover:opacity-[100%] tracking-thin font-medium opacity-[60%] text-sm w-max cursor-pointer transition-[150ms]"
                              >
                                {title}
                              </h1>
                            </div>
                          );
                        })}

                        <span className="mt-6" />

                        {!hasJWT && (
                          <Link href="/auth?for=login" className="w-[100%]">
                            <Button className="mb-4 w-full" variant={"outline"}>
                              Login
                            </Button>
                          </Link>
                        )}

                        <Link
                          href={`${hasJWT ? "/home" : "/auth"}`}
                          className="w-[100%]"
                        >
                          <Button className="w-full">
                            {hasJWT ? "Home" : "Register"}
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <div className="flex flex-col items-center min-w-[200px] w-[200px] pt-4">
                        <Button
                          className="w-[80%] text-start"
                          onClick={handleHome}
                          variant={`${
                            $sideOption == SideOption.Home
                              ? "secondary"
                              : "outline"
                          }`}
                        >
                          <HomeIcon className="min-w-[18px] min-h-[18px] mr-2" />

                          <h1 className="xs:text-sm text-md normal-case w-full">
                            Home
                          </h1>
                        </Button>

                        <Separator className="mt-4 mb-4" />

                        {$sideOption == SideOption.Home && (
                          <>
                            {!$currentFolderId ? (
                              <Button
                                className="w-[80%] text-start"
                                variant={"outline"}
                                onClick={() => {
                                  setOpen(false);
                                  setCreatingFolder(true);
                                }}
                              >
                                <PlusIcon className="min-w-[18px] min-h-[18px] mr-2" />

                                <h1 className="xs:text-sm text-md normal-case w-full">
                                  New folder
                                </h1>
                              </Button>
                            ) : (
                              <Button
                                className="w-[80%] text-start"
                                variant={"outline"}
                                onClick={() => {
                                  setOpen(false);
                                  setUploadingFiles(true);
                                }}
                              >
                                <FilePlusIcon className="min-w-[18px] min-h-[18px] mr-2" />

                                <h1 className="xs:text-sm text-md normal-case w-full">
                                  Upload files
                                </h1>
                              </Button>
                            )}
                          </>
                        )}

                        <Separator className="mt-4 mb-4" />
                        <Button
                          onClick={() => {
                            setOpen(false);
                            setViewingUsage(true);
                          }}
                          className="w-[80%] text-start"
                          variant={"outline"}
                        >
                          <TimerIcon className="min-w-[18px] min-h-[18px] mr-2" />

                          <h1 className="xs:text-sm text-md normal-case w-full">
                            Data usage
                          </h1>
                        </Button>

                        <Button
                          onClick={() => {
                            setOpen(false);
                            setTerminatingAccount(true);
                          }}
                          className="w-[80%] text-start mt-4"
                          variant={"outline"}
                        >
                          <CrossCircledIcon className="min-w-[18px] min-h-[18px] mr-2" />

                          <h1 className="xs:text-sm text-md normal-case w-full">
                            Terminate
                          </h1>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        )}

        {isHomepage ? (
          <>
            <Link href="https://shadofer.com">
              <img
                src="/stamtsag.ico"
                className="xs:hidden w-[28px] h-[28px] mr-2 cursor-pointer"
              />
            </Link>

            <h1 className="xs:hidden font-black text-3xl mr-2">/</h1>

            <img
              onClick={scrollTop}
              src="/favicon.ico"
              className="xs:hidden w-[28px] h-[28px] mr-2 cursor-pointer"
            />
            <h1
              onClick={!isInHome ? scrollTop : handleHome}
              className="xs:text-lg tracking-tighter font-bold text-xl mr-6 translate-x-[-3px] font-black cursor-pointer"
            >
              Litestore
            </h1>
          </>
        ) : (
          <Link
            href={`${!isInHome ? "/" : "/home"}`}
            className="flex items-center no-underline"
            onClick={!isInHome ? scrollTop : handleHome}
          >
            <img
              src="/favicon.ico"
              className="w-[28px] h-[28px] mr-2 cursor-pointer"
            />
            <h1 className="xs:text-lg tracking-tighter font-bold text-xl mr-6 translate-x-[-3px] font-black cursor-pointer">
              Litestore
            </h1>
          </Link>
        )}

        {!isHomepage && <span className="flex-1" />}

        {isHomepage && (
          <>
            {headers.map(({ title, ref }) => {
              return (
                <div
                  onClick={() =>
                    document.querySelector(`#${ref}`)?.scrollIntoView({
                      block: "start",
                    })
                  }
                  key={title}
                  className="flex items-center mr-6"
                >
                  <h1 className="xs:hidden hover:opacity-[100%] tracking-thin font-medium opacity-[60%] text-sm w-max cursor-pointer transition-[150ms]">
                    {title}
                  </h1>
                </div>
              );
            })}

            <span className="flex-1" />

            <div className="xs:hidden">
              {!hasJWT && (
                <Link href="/auth?for=login">
                  <Button variant={"outline"}>Login</Button>
                </Link>
              )}

              <Link href={`${hasJWT ? "/home" : "/auth"}`}>
                <Button className="ml-4">{hasJWT ? "Home" : "Register"}</Button>
              </Link>

              <span className="xs:mr-4 mr-10" />
            </div>
          </>
        )}

        <a
          href="https://github.com/Shadofer/litestore"
          target="_blank"
          className="mr-2"
        >
          <Button size="icon" variant="ghost">
            <GitHubLogoIcon
              className="xs:w-[16px] xs:h-[16px]"
              width={20}
              height={20}
            />
          </Button>
        </a>

        <ThemeToggle />

        {isInHome && (
          <Button
            onClick={logout}
            className="ml-1.5"
            size="icon"
            variant="ghost"
          >
            <ArrowRightIcon
              className="xs:w-[16px] xs:h-[16px]"
              width={20}
              height={20}
            />
          </Button>
        )}
      </div>

      <Separator />
    </div>
  );
}

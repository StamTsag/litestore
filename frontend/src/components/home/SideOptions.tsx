import {
  SideOption,
  creatingFolder,
  currentFolderId,
  files,
  sideOption,
  terminatingAccount,
  uploadingFiles,
  viewingUsage,
} from "@/lib/stores";

import { useRouter } from "next/navigation";
import { useWritable } from "react-use-svelte-store";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  CrossCircledIcon,
  FilePlusIcon,
  HomeIcon,
  PlusIcon,
  TimerIcon,
} from "@radix-ui/react-icons";

export default function SideOptions() {
  const router = useRouter();

  const [_, setCreatingFolder] = useWritable(creatingFolder);
  const [__, setUploadingFiles] = useWritable(uploadingFiles);
  const [___, setViewingUsage] = useWritable(viewingUsage);
  const [____, setTerminatingAccount] = useWritable(terminatingAccount);
  const [$sideOption, setSideOption] = useWritable(sideOption);
  const [$currentFolderId, setCurrentFolderId] = useWritable(currentFolderId);
  const [_____, setFiles] = useWritable(files);

  const handleHome = () => {
    setSideOption(SideOption.Home);

    router.replace("/home");

    // @ts-ignore
    setCurrentFolderId(undefined);

    setFiles([]);
  };

  return (
    <div
      className={`xs:hidden flex flex-col items-center min-w-[200px] "w-[200px] h-screen border-r pt-4`}
    >
      <Button
        className={`w-[80%] text-start`}
        onClick={handleHome}
        variant={`${$currentFolderId ? "outline" : "default"}`}
      >
        <HomeIcon className="min-w-[18px] min-h-[18px] mr-2" />

        <h1 className="xs:text-sm text-md normal-case w-full">Home</h1>
      </Button>
      <Separator className="mt-4 mb-4" />
      {$sideOption == SideOption.Home && (
        <>
          {!$currentFolderId ? (
            <Button
              onClick={() => setCreatingFolder(true)}
              className="w-[80%] text-start"
              variant={"outline"}
            >
              <PlusIcon className="min-w-[18px] min-h-[18px] mr-2" />

              <h1 className="xs:text-sm text-md normal-case w-full">
                New folder
              </h1>
            </Button>
          ) : (
            <Button
              onClick={() => setUploadingFiles(true)}
              className="w-[80%] text-start"
              variant={"outline"}
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
        onClick={() => setViewingUsage(true)}
        className="w-[80%] text-start"
        variant={"outline"}
      >
        <TimerIcon className="min-w-[18px] min-h-[18px] mr-2" />

        <h1 className="xs:text-sm text-md normal-case w-full">Data usage</h1>
      </Button>

      <Button
        onClick={() => setTerminatingAccount(true)}
        className="w-[80%] text-start mt-4"
        variant={"outline"}
      >
        <CrossCircledIcon className="min-w-[18px] min-h-[18px] mr-2" />

        <h1 className="xs:text-sm text-md normal-case w-full">Terminate</h1>
      </Button>
    </div>
  );
}

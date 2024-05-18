"use client";

import HomeContent from "./HomeContent";
import SideOptions from "./SideOptions";

export default function Home() {
  return (
    <div className="flex flex-wrap" onContextMenu={(e) => e.preventDefault()}>
      <SideOptions />

      <HomeContent />
    </div>
  );
}

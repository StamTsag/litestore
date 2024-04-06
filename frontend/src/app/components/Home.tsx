"use client";

import SideOptions from "./home/SideOptions";
import ContentView from "./home/ContentView";

export default function Home() {
  return (
    <div className="flex flex-wrap" onContextMenu={(e) => e.preventDefault()}>
      <SideOptions />

      <ContentView />
    </div>
  );
}

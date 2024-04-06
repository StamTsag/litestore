"use client";

import Background from "./components/global/Background";
import TopBar from "./components/global/TopBar";
import Index from "./components/Index";
import Footer from "./components/global/Footer";

export default function RouteIndex() {
  return (
    <div>
      <Background />

      <TopBar />

      <Index />

      <Footer />
    </div>
  );
}

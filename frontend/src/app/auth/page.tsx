import { AuthView } from "@/components/auth/AuthView";
import Footer from "@/components/homepage/Footer";
import TopNav from "@/components/global/TopNav";
import { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Litestore | Authentication",
};

export default function Auth() {
  return (
    <div>
      <Head>
        <title>Litestore | Authentication</title>
      </Head>

      <TopNav />

      <AuthView />

      <Footer fixed />
    </div>
  );
}

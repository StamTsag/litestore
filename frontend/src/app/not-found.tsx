import BlurredBackground from "./components/global/Background";
import LitestoreContentNotFound from "./components/global/NotFound";
import LitestoreBar from "./components/global/TopBar";
import LitestoreFooter from "./components/global/Footer";

export default function Page() {
  return (
    <div>
      <BlurredBackground />

      <LitestoreBar />

      <LitestoreContentNotFound />

      <LitestoreFooter />
    </div>
  );
}

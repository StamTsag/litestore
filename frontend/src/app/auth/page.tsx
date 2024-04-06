import Auth from "../components/Auth";
import Background from "../components/global/Background";
import Footer from "../components/global/Footer";
import TopBarEmpty from "../components/global/TopBarEmpty";

export default function RouteAuth() {
  return (
    <div>
      <Background />

      <TopBarEmpty />

      <Auth />

      <Footer />
    </div>
  );
}

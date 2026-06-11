import MainBanner from "../../components/MainBanner";
import Services from "../../components/Services";
import Partners from "../../components/Partners";
import BottomBanner from "../../components/BottomBanner";
import Navtop from "../../components/Navtop";

const Home = () => {
  return (
    <>
      <Navtop />
      <MainBanner />
      <Services />
      <Partners />
      <BottomBanner />
    </>
  );
};

export default Home;

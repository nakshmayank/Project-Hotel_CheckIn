import MainBanner from "../../components/MainBanner";
import Services from "../../components/Services";
import Partners from "../../components/Partners";
import BottomBanner from "../../components/BottomBanner";

const Home = () => {

  return (
    <>
      <div className={`pt-20`}>
        <MainBanner />
        <Services />
        <Partners />
        <BottomBanner />
      </div>
    </>
  );
}

export default Home;

import MainBanner from "../components/MainBanner";
import Services from "../components/Services";
import Partners from "../components/Partners";
import BottomBanner from "../components/BottomBanner";
import { useAppContext } from "../context/AppContext";
import Login from "../components/Login";

const Home = () => {
  const { showLogin, setShowLogin } = useAppContext();

  return (
    <>
      <div className={`pt-20 ${showLogin ? "blur-sm" : ""}`}>
        <MainBanner />
        <Services />
        <Partners />
        <BottomBanner />
      </div>

      {showLogin && (
        <Login/>
      )}
    </>
  );
}

export default Home;

import { useAppContext } from "../context/AppContext";

const Loader = () => {
  const {authLoading} = useAppContext();
  return (
    <div className={`${authLoading ? "h-screen flex items-center justify-center opacity-0" : "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[6px] bg-black/20"} fade-in`}>
      <div className="w-7 h-7 border-4 border-primary-500/80 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default Loader;

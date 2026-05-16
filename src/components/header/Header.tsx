import TopBar from "./TopBar";
import MainHeader from "./MainHeader";
import NavBar from "./NavBar";

const Header = () => {
  return (
    <>
      <TopBar />
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-[9999] bg-white">
        <MainHeader />
        <NavBar />
      </div>
    </>
  );
};

export default Header;

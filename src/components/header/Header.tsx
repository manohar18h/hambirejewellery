import TopBar from "./TopBar";
import MainHeader from "./MainHeader";
import NavBar from "./NavBar";

const Header = () => {
  return (
    <>
      {/* Mobile */}
      <div className="fixed left-0 top-0 z-[9999] hidden w-full bg-white shadow-sm max-md:block">
        <TopBar />
        <MainHeader />
      </div>

      {/* Desktop */}
      <div className="sticky top-0 z-[9999] bg-white max-md:hidden">
        <TopBar />
        <MainHeader />
        <NavBar />
      </div>

      <div className="hidden h-[80px] max-md:block" />
    </>
  );
};

export default Header;
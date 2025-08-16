import Logo from "../logo";
import { NavLinks } from "./navLinks";
import AnimatedThemeTogglerDemo from "../themeSwitcher";
import LocaleSwitcher from "../localeSwitcher";
import AuthActionButton from "./profileAction";

const Nav = () => {
  return (
    <nav className="fixed top-0 left-0  w-full h-[100px] z-50 dark:bg-slate-800/20 bg-slate-300/20">
      <div className="outer-section-container w-full h-full grid grid-cols-2  lg:grid-cols-3 justify-between items-center">
        <Logo />
        <div className="justify-self-end lg:justify-self-center">
          <NavLinks />
        </div>

        <div className="w-full backdrop-blur-2xl h-full absolute top-0 left-0 -z-1"></div>

        <div className="hidden lg:flex items-center gap-4 z-10 justify-self-end">
          <AuthActionButton />
          <AnimatedThemeTogglerDemo />
          <LocaleSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Nav;

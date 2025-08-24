import Image from "next/image";
import Link from "next/link";

import logo from "@/../public/img/logo/logo.png";
// Logo component
const Logo = () => {
  return (
    <Link
      href={"/"}
      className="w-[60px] h-[60px] flex items-center justify-start"
    >
      <Image
        src={logo}
        alt="Logo"
        priority={true}
        className="w-full h-full object-contain"
      />
    </Link>
  );
};

export default Logo;

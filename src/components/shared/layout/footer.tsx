import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
// Components
import Heading from "@/components/shared/style/heading";
import logo from "@/public/img/shared/logo.svg";
// Icons
import faceBook from "@/public/icons/social/faceBook.svg";
import x from "@/public/icons/social/x.svg";
import instagram from "@/public/icons/social/instagram.svg";
import linkedIn from "@/public/icons/social/linkedIn.svg";
import youtube from "@/public/icons/social/youtube.svg";
import tikTok from "@/public/icons/social/tikTok.svg";
import snap from "@/public/icons/social/snap.svg";
import SectionButton from "../style/sectionButton";

// Constants
const socialMedia = [
  { href: "faceBook", src: faceBook, alt: "faceBook" },
  { href: "x", src: x, alt: "x" },
  { href: "instagram", src: instagram, alt: "instagram" },
  { href: "linkedIn", src: linkedIn, alt: "linkedIn" },
  { href: "youtube", src: youtube, alt: "youtube" },
  { href: "tikTok", src: tikTok, alt: "tikTok" },
  { href: "snap", src: snap, alt: "snap" },
];
const usefulLinks = [
  { href: "/about", key: "studios" },
  { href: "/services", key: "about" },
  { href: "/blog", key: "media" },
  { href: "/contact", key: "podcast" },
  { href: "/contact", key: "guidelines" },
  { href: "/contact", key: "delivery" },
];

interface FooterProps {
  showProjectCard?: boolean;
}

const Footer = ({ showProjectCard = true }: FooterProps) => {
  const t = useTranslations("Footer");

  return (
    <footer className="outer-section-container flex flex-col gap-y-[120px] items-center justify-center py-[120px]">
      {/* Have a project card ? */}
      {showProjectCard && (
        <div className="flex items-center justify-between w-full py-14 px-20 rounded-3xl bg-primary">
          <Heading size="md">{"Hey you"}</Heading>
          <SectionButton
            text={"haveProject"}
            href="/contact"
            size="md"
            width="fit"
            color="secondary"
          />
        </div>
      )}

      {/* Footer items */}
      <div className="w-full grid grid-cols-1 gap-y-[60px] lg:grid-cols-4">
        <div className="lg:col-span-2 justify-self-center lg:justify-self-start">
          <Image
            className="w-[185px] mx-auto lg:mx-0"
            src={logo}
            alt="logo"
            width={1000}
            height={1000}
          />
          {/* Links */}
          <div className="flex items-center gap-2">
            {/* {socialMedia.map(({ href, src, alt }) => (
              <Link
                key={alt}
                href={href}
                className={`flex items-center justify-center w-[37px] h-[37px] rounded-full p-[1px] border-[1px] border-secondary cursor-pointer`}
              >
                <Image src={src} alt={alt} className="w-[15px] h-[15px]" />
              </Link>
            ))} */}
          </div>
        </div>

        {/*  Useful links */}
        <div className="justify-self-center text-center lg:text-start lg:justify-self-start">
          <h3 className="text-[18px] mb-[18px] font-[700]">
            Here are some useful links
          </h3>
          {/* Links */}
          {/* <ul className="flex flex-col gap-2 mt-4">
            {usefulLinks.map(({ href, key }) => (
              <li key={key}>
                <Link href={href}>{t(`usefulLinks.links.${key}`)}</Link>
              </li>
            ))}
          </ul> */}
        </div>

        {/* Contact us */}
        <div className="justify-self-center text-center lg:text-start lg:justify-self-start">
          <h3 className="text-[18px] mb-[18px] font-[700]">
            Here are some useful links
          </h3>
          <div>
            Here are some useful links Here are some useful links Here are some
            useful links
            <Link
              className="text-primary"
              href="mailto:contact@podmedia.network"
            >
              📩 contact@podmedia.network
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

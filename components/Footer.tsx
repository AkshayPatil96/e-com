import LogoWhite from "@/public/assets/icons/logo-white.svg";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { SocialIcon } from "react-social-icons";

type Props = {};

type Link = {
  href: string;
  text: string;
};

const Footer: FC<Props> = ({}) => {
  const quickLinks: Link[] = [
    { href: "/#", text: "Privacy Policy" },
    { href: "/#", text: "Terms of Use" },
    { href: "/#", text: "FAQ" },
    { href: "/#", text: "Insights" },
    { href: "/#", text: "Contact" },
  ];

  const accountLinks: Link[] = [
    { href: "/account", text: "My Account" },
    { href: "/auth/login", text: "Login / Register" },
    { href: "/#", text: "Cart" },
    { href: "/#", text: "Wishlist" },
  ];
  return (
    <div className="bg-black text-white">
      <div className="container py-10">
        <div className="grid grid-cols-12 justify-between gap-4 gap-y-12 m-auto my-12">
          <div className="col-span-12 lg:col-span-3 md:justify-self-center flex flex-col">
            <Image
              src={LogoWhite}
              alt="Logo"
              width={200}
              height={100}
            />
            <p className="text-sm mt-3 lg:mt-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              eget nunc nec purus posuere varius. Sed auctor elit quis
              consectetur.
            </p>
          </div>

          <div className="grid grid-cols-12 justify-start items-start gap-y-8 md:gap-0 col-span-12 lg:col-span-9">
            <div className="col-span-12 md:col-span-4 lg:justify-self-center">
              <h4 className="text-xl font-medium mb-3 lg:mb-6">Quick Links</h4>
              <ul className="flex flex-col gap-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm font-light"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-12 md:col-span-4 lg:justify-self-center">
              <h4 className="text-xl font-medium mb-3 lg:mb-6">Account</h4>
              <ul className="flex flex-col gap-y-2">
                {accountLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      passHref
                      className="text-sm font-light"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-12 md:col-span-4 lg:justify-self-center">
              <h4 className="text-xl font-medium mb-3 lg:mb-6">Supporrt</h4>
              <ul className="flex flex-col gap-y-2">
                <li className="text-sm font-light">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                </li>
                <li>
                  <a
                    href="tel:+1234567890"
                    className="text-sm font-light"
                  >
                    +1234567890
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:aksh.patil2706@gmail.com"
                    className="text-sm font-light"
                  >
                    aksh.patil2706@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center flex items-center justify-center sm:gap-4">
          <SocialIcon
            bgColor="transparent"
            fgColor="#646464"
            target="_blank"
            as="a"
            url="https://pinterest.com"
          />
          <SocialIcon
            bgColor="transparent"
            fgColor="#646464"
            target="_blank"
            as="a"
            url="https://facebook.com"
          />
          <SocialIcon
            bgColor="transparent"
            fgColor="#646464"
            target="_blank"
            as="a"
            url="https://x.com"
          />
          <SocialIcon
            bgColor="transparent"
            fgColor="#646464"
            target="_blank"
            as="a"
            url="https://linkedin.com"
          />
          <SocialIcon
            bgColor="transparent"
            fgColor="#646464"
            target="_blank"
            as="a"
            url="https://instagram.com"
          />
          <SocialIcon
            bgColor="transparent"
            fgColor="#646464"
            target="_blank"
            as="a"
            url="https://youtube.com"
          />
        </div>
      </div>

      <hr className="border-t-2 border-white border-opacity-20" />

      <div className="p-2 text-center text-[#646464] text-sm">
        @2021 UrbanStore. All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;

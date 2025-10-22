import Link from "next/link";
import { SocialIcon } from "react-social-icons";

const links = [
  { title: "Terms and Conditions", href: "#" },
  { title: "Privacy Policy", href: "#" },
  { title: "Contact Us", href: "#" },
  { title: "Help", href: "#" },
];

const AuthFooter = () => {
  return (
    <footer className="py-8 border-t bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-muted-foreground hover:text-primary block duration-150"
            >
              <span>{link.title}</span>
            </Link>
          ))}
        </div>
          
        <div className="my-4 text-center flex items-center justify-center sm:gap-2">
          <SocialIcon
            bgColor="transparent"
            fgColor="#646464"
            target="_blank"
            as="a"
            url="https://pinterest.com"
            className="!size-8"
          />
          <SocialIcon
            bgColor="transparent"
            fgColor="#646464"
            target="_blank"
            as="a"
            url="https://facebook.com"
            className="!size-8"
          />
          <SocialIcon
            bgColor="transparent"
            fgColor="#646464"
            target="_blank"
            as="a"
            url="https://x.com"
            className="!size-8"
          />
          <SocialIcon
            bgColor="transparent"
            fgColor="#646464"
            target="_blank"
            as="a"
            url="https://linkedin.com"
            className="!size-8"
          />
          <SocialIcon
            bgColor="transparent"
            fgColor="#646464"
            target="_blank"
            as="a"
            url="https://instagram.com"
            className="!size-8"
          />
          <SocialIcon
            bgColor="transparent"
            fgColor="#646464"
            target="_blank"
            as="a"
            url="https://youtube.com"
            className="!size-8"
          />
        </div>

        <span className="text-muted-foreground block text-center text-sm">
          © {new Date().getFullYear()} E-Com, All rights reserved
        </span>
      </div>
    </footer>
  );
};

export default AuthFooter;

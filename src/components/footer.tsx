import React from "react";
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="mt-10 flex w-full flex-col items-center space-y-5 border-t border-white/5 bg-[#0a0a0a] p-8 pb-28">
      <Image
        src="/icon.png"
        alt="logo"
        width="100"
        height="100"
        suppressHydrationWarning
        className="h-14 w-14 rounded-xl"
      />
      <div className="flex items-center space-x-5">
        <a
          href="https://github.com/Dovakiin0/Kitsune"
          target="_blank"
          className="text-gray-400 transition hover:text-violet-400"
        >
          <GitHubLogoIcon suppressHydrationWarning width="22" height="22" />
        </a>
        <a
          href="https://discord.gg/6yAJ3XDHTt"
          target="_blank"
          className="text-gray-400 transition hover:text-violet-400"
        >
          <DiscordLogoIcon suppressHydrationWarning width="22" height="22" />
        </a>
      </div>
      <p className="max-w-xl text-center text-xs text-gray-500">
        Kitsune does not store any files on the server, we only link to the media
        which is hosted on 3rd party services.
      </p>
      <p className="text-xs text-gray-600">&copy; Kitsune</p>
    </footer>
  );
};

export default Footer;

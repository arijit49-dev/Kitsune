import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="mt-10 flex w-full flex-col items-center space-y-5 border-t border-white/5 bg-[#0a0a0a] p-8 pb-28">
      <Image
        src="https://media.base44.com/images/public/6ac378e8c946a955146d522a/02a885b0a_generated_d80d421c.png"
        alt="Mekko Streams logo"
        width="100"
        height="100"
        suppressHydrationWarning
        className="h-14 w-14 rounded-xl"
      />
      <p className="max-w-xl text-center text-xs text-gray-500">
        Mekko Streams does not store any files on the server, we only link to
        the media which is hosted on 3rd party services.
      </p>
      <p className="text-xs text-gray-600">&copy; Mekko Streams</p>
    </footer>
  );
};

export default Footer;

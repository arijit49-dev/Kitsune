"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

import Container from "./container";
import { Separator } from "./ui/separator";

import { ROUTES } from "@/constants/routes";
import React, { ReactNode, useEffect, useState } from "react";

import SearchBar from "./search-bar";
import { InfoIcon, MenuIcon, X } from "lucide-react";
import useScrollPosition from "@/hooks/use-scroll-position";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import LoginPopoverButton from "./login-popover-button";
import { useAuthStore } from "@/store/auth-store";
import { pb } from "@/lib/pocketbase";
import NavbarAvatar from "./navbar-avatar";
import { toast } from "sonner";
import { Alert, AlertTitle } from "@/components/ui/alert";

const menuItems: Array<{ title: string; href?: string }> = [
  // {
  //   title: "Home",
  //   href: ROUTES.HOME,
  // },
  // {
  //   title: "Catalog",
  // },
  // {
  //   title: "News",
  // },
  // {
  //   title: "Collection",
  // },
];

const NavBar = () => {
  const auth = useAuthStore();
  const { y } = useScrollPosition();
  const isHeaderFixed = true;
  const isHeaderSticky = y > 0;
  const [hasSeenDomainChangeBanner, setHasSeenDomainChangeBanner] =
    useState<boolean>(() => {
      if (typeof window !== "undefined" && window.localStorage) {
        return localStorage.getItem("seenDomainChangeBanner") === "true";
      }
      return true;
    });

  useEffect(() => {
    const refreshAuth = async () => {
      const auth_token = JSON.parse(
        localStorage.getItem("pocketbase_auth") as string,
      );
      if (auth_token) {
        try {
          const user = await pb.collection("users").authRefresh();
          if (user) {
            auth.setAuth({
              id: user.record.id,
              email: user.record.email,
              username: user.record.username,
              avatar: user.record.avatar,
              collectionId: user.record.collectionId,
              collectionName: user.record.collectionName,
              autoSkip: user.record.autoSkip,
              created: user.record.created,
            });
          }
        } catch (e) {
          console.error("Auth refresh error:", e);
          localStorage.removeItem("pocketbase_auth");
          auth.clearAuth();
          toast.error("Login session expired.", {
            style: { background: "red" },
          });
        }
      }
    };
    refreshAuth();
  }, []);

  return (
    <div
      className={cn([
        "h-fit w-full",
        "sticky top-0 z-[100] duration-300",
        isHeaderFixed ? "fixed" : "",
        isHeaderSticky
          ? "border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl"
          : "bg-gradient-to-b from-[#0a0a0a] to-transparent",
      ])}
    >
      {!hasSeenDomainChangeBanner && (
        <Alert variant="default" className="text-amber-300 bg-opacity-5">
          <AlertTitle className="font-bold flex items-center justify-center space-x-2">
            <div className="flex items-center gap-2">
              <InfoIcon size="20" />
              <p>
                The domain has been changed from <i>kitsunee.online</i>. Please
                bookmark the new domain <i>kitsunee.moe</i>
              </p>
            </div>
            <p
              className="cursor-pointer"
              onClick={() => {
                localStorage.setItem("seenDomainChangeBanner", "true");
                setHasSeenDomainChangeBanner(true);
              }}
            >
              <i>
                <u>Close</u>
              </i>
            </p>
          </AlertTitle>
        </Alert>
      )}
      <Container className="flex items-center gap-4 py-3">
        <Link
          href={ROUTES.HOME}
          className="flex shrink-0 cursor-pointer items-center gap-2"
        >
          <Image
            src="https://media.base44.com/images/public/6ac378e8c946a955146d522a/02a885b0a_generated_d80d421c.png"
            alt="Mekko Streams logo"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <h1 className="hidden text-lg font-bold tracking-tight text-white sm:block">
            Mekko Streams
          </h1>
        </Link>

        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-xl">
            <SearchBar />
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {auth.auth ? <NavbarAvatar auth={auth} /> : <LoginPopoverButton />}
        </div>
        <div className="flex shrink-0 items-center gap-3 lg:hidden">
          <MobileMenuSheet trigger={<MenuIcon suppressHydrationWarning />} />
          {auth.auth ? <NavbarAvatar auth={auth} /> : <LoginPopoverButton />}
        </div>
      </Container>
    </div>
  );
};

const MobileMenuSheet = ({ trigger }: { trigger: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent
        className="flex flex-col w-[80vw] z-[150]"
        hideCloseButton
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="w-full h-full relative">
          <SheetClose className="absolute top-0 right-0">
            <X />
          </SheetClose>
          <div className="flex flex-col gap-5 mt-10">
            {menuItems.map((menu, idx) => (
              <Link
                href={menu.href || "#"}
                key={idx}
                onClick={() => setOpen(false)}
              >
                {menu.title}
              </Link>
            ))}
            <Separator />
            <SearchBar onAnimeClick={() => setOpen(false)} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavBar;

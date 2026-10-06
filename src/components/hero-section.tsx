"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";

import Container from "./container";
import { Button } from "./ui/button";

import React from "react";
import { ArrowLeft, ArrowRight, Info, Play, Star } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { ButtonLink } from "./common/button-link";
import { MediaList } from "@/types/miruro-api";
import { Badge } from "./ui/badge";

type IHeroSectionProps = {
  spotlightAnime: MediaList[];
  isDataLoading: boolean;
};

const HeroSection = (props: IHeroSectionProps) => {
  const [api, setApi] = React.useState<CarouselApi>();

  if (props.isDataLoading || !props.spotlightAnime?.length)
    return <LoadingSkeleton />;

  return (
    <div className="h-[80vh] w-full relative">
      <Carousel className="w-full" setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {props.spotlightAnime.map((anime, index) => (
            <CarouselItem key={anime.id || index}>
              <HeroCarouselItem anime={anime} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-24 right-10 z-50 isolate hidden items-center gap-3 md:flex 3xl:bottom-10">
        <Button
          onClick={() => {
            api?.scrollPrev();
          }}
          className="h-10 w-10 rounded-full border border-white/20 bg-black/40 text-white backdrop-blur hover:bg-violet-600"
        >
          <ArrowLeft className="shrink-0" />
        </Button>
        <Button
          onClick={() => api?.scrollNext()}
          className="h-10 w-10 rounded-full border border-white/20 bg-black/40 text-white backdrop-blur hover:bg-violet-600"
        >
          <ArrowRight className="shrink-0" />
        </Button>
      </div>
    </div>
  );
};

const HeroCarouselItem = ({ anime }: { anime: MediaList }) => {
  const bgImage =
    anime.bannerImage ||
    anime.coverImage?.extraLarge ||
    anime.coverImage?.large ||
    "";
  const title =
    anime.title?.english || anime.title?.romaji || anime.title?.native || "Untitled";

  return (
    <div
      className="w-full bg-cover bg-no-repeat bg-center h-[80vh] relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-transparent"></div>
      <div className="absolute inset-0 z-10 h-full w-full bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>

      {/* Content Section */}
      <div className="w-full h-[calc(100%-5.25rem)] relative z-20">
        <Container className="w-full h-full flex flex-col justify-end md:justify-center pb-10">
          <div className="space-y-4 lg:w-[45vw]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-400">
              Featured
            </span>
            <h1 className="line-clamp-2 text-3xl font-black text-white md:text-5xl">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {anime.format && (
                <Badge className="rounded-full border border-white/10 bg-white/5 text-gray-200">
                  {anime.format}
                </Badge>
              )}
              {anime.seasonYear && (
                <Badge
                  variant="outline"
                  className="rounded-full border-white/10 text-gray-300"
                >
                  {anime.season ? `${anime.season} ` : ""}
                  {anime.seasonYear}
                </Badge>
              )}
              {!!anime.averageScore && (
                <Badge className="rounded-full border border-violet-500/40 bg-violet-500/15 text-violet-300">
                  <Star className="mr-1 h-3 w-3 fill-violet-300" />
                  {(anime.averageScore / 10).toFixed(1)}
                </Badge>
              )}
              {anime.genres?.slice(0, 4).map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-gray-300 backdrop-blur"
                >
                  {g}
                </span>
              ))}
            </div>

            <div className="!mt-6 flex flex-wrap items-center gap-3">
              <ButtonLink
                href={`${ROUTES.ANIME_DETAILS}/${anime.id}`}
                className="h-10 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-500"
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                View Details
              </ButtonLink>
              <ButtonLink
                href={`${ROUTES.ANIME_DETAILS}/${anime.id}`}
                className="h-10 rounded-full border border-white/20 bg-transparent px-5 text-sm font-semibold text-white hover:bg-white/10"
              >
                <Info className="mr-2 h-4 w-4" />
                More Info
              </ButtonLink>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="h-[80vh] w-full relative">
      <div className="w-full h-[calc(100%-5.25rem)] mt-[5.25rem] relative z-20">
        <Container className="w-full h-full flex flex-col justify-end md:justify-center pb-10">
          <div className="space-y-2 lg:w-[40vw]">
            <div className="h-16 animate-pulse bg-white/5 w-[75%]"></div>
            <div className="h-40 animate-pulse w-full bg-white/5"></div>
            <div className="flex items-center gap-5">
              <span className="h-10 w-[7.5rem] animate-pulse bg-white/5"></span>
              <span className="h-10 w-[7.5rem] animate-pulse bg-white/5"></span>
            </div>
          </div>
        </Container>
      </div>
      <div className="absolute hidden md:flex items-center gap-5 right-10 bottom-32 z-50 isolate">
        <span className="h-10 w-10 rounded-full animate-pulse bg-white/5"></span>
        <span className="h-10 w-10 rounded-full animate-pulse bg-white/5"></span>
      </div>
    </div>
  );
};
export default HeroSection;

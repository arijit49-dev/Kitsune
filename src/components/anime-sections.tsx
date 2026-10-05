"use client";

import React from "react";
import Container from "./container";
import AnimeCard from "./anime-card";

import BlurFade from "./ui/blur-fade";
import { MediaList } from "@/types/miruro-api";
import { ROUTES } from "@/constants/routes";

import Button from "./common/custom-button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SectionHeading from "./section-heading";

type Props = {
  animeList: MediaList[];
  loading: boolean;
  title: string;
  eyebrow?: string;
  page?: number;
  hasNextPage?: boolean;
  onPageChange?: (newPage: number) => void;
};

const AnimeSections = ({
  animeList,
  loading,
  title: sectionTitle,
  eyebrow,
  page = 1,
  hasNextPage = false,
  onPageChange,
}: Props) => {
  if (loading || !animeList?.length) return <LoadingSkeleton />;
  return (
    <Container className="flex flex-col gap-5 py-10 items-center lg:items-start ">
      <SectionHeading eyebrow={eyebrow} title={sectionTitle} />
      <div className="no-scrollbar flex w-full snap-x gap-4 overflow-x-auto pb-2">
        {animeList.map((anime, idx) => {
          const title =
            anime.title?.english || anime.title?.romaji || anime.title?.native || "Untitled";
          const poster =
            anime.coverImage?.extraLarge || anime.coverImage?.large || "";

          return (
            <div key={`${anime.id}-${idx}`} className="shrink-0 snap-start">
              <BlurFade delay={idx * 0.03} inView>
                <AnimeCard
                  title={title}
                  format={anime.format}
                  score={anime.averageScore}
                  poster={poster}
                  className="self-center justify-self-center"
                  href={`${ROUTES.ANIME_DETAILS}/${anime.id}`}
                />
              </BlurFade>
            </div>
          );
        })}
      </div>
      {onPageChange && (
        <div className="flex items-center justify-end w-full gap-3 mt-4">
          <Button
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            disabled={page <= 1}
            className="h-9 w-9 rounded-full border border-white/10 bg-white/5 p-0 text-white hover:bg-violet-600 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
            className="h-9 w-9 rounded-full border border-white/10 bg-white/5 p-0 text-white hover:bg-violet-600 disabled:opacity-40"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Container>
  );
};

const LoadingSkeleton = () => {
  return (
    <Container className="flex flex-col gap-5 py-10 items-center lg:items-start ">
      <div className="h-10 w-[15.625rem] animate-pulse bg-slate-800 rounded"></div>
      <div className="no-scrollbar flex w-full gap-4 overflow-x-auto pb-2">
        {[1, 1, 1, 1, 1, 1, 1].map((_, idx) => {
          return (
            <div
              key={idx}
              className="shrink-0 rounded-2xl h-[18rem] w-[12rem] animate-pulse bg-slate-800"
            ></div>
          );
        })}
      </div>
    </Container>
  );
};

export default AnimeSections;

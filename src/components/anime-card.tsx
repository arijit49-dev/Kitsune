import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

import { cn, formatSecondsToMMSS } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { WatchHistory } from "@/hooks/use-get-bookmark";
import { Progress } from "./ui/progress";

type Props = {
  className?: string;
  poster: string;
  title: string;
  episodeCard?: boolean;
  episodes?: number | null;
  score?: number | null;
  format?: string | null;
  subTitle?: string;
  displayDetails?: boolean;
  variant?: "sm" | "lg";
  href?: string;
  showGenre?: boolean;
  watchDetail?: WatchHistory | null;
};

const AnimeCard = ({
  displayDetails = true,
  variant = "sm",
  ...props
}: Props) => {
  const safeCurrent =
    typeof props.watchDetail?.current === "number"
      ? props.watchDetail.current
      : 0;
  const safeTotal =
    typeof props.watchDetail?.timestamp === "number" &&
    props.watchDetail.timestamp > 0
      ? props.watchDetail.timestamp
      : 0;

  const clampedCurrent = Math.min(safeCurrent, safeTotal);
  const percentage = safeTotal > 0 ? (clampedCurrent / safeTotal) * 100 : 0;

  return (
    <Link href={props.href as string}>
      <div
        className={cn([
          "group relative cursor-pointer overflow-hidden rounded-2xl ring-1 ring-white/5 transition duration-300 hover:scale-[1.03] hover:ring-violet-500/40",
          variant === "sm" &&
            "h-[12rem] min-[320px]:h-[16.625rem] sm:h-[18rem] max-w-[12.625rem] md:min-w-[12rem]",
          variant === "lg" &&
            "max-w-[12.625rem] md:max-w-[18.75rem] h-auto md:h-[25rem] shrink-0 lg:w-[18.75rem]",
          props.className,
        ])}
      >
        <Image
          src={props.poster}
          alt={props.title}
          height={100}
          width={100}
          className="w-full h-full object-cover"
          unoptimized
        />
        {displayDetails && (
          <>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            {!!props.score && (
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                <Star className="h-3 w-3 fill-violet-400 text-violet-400" />
                {(props.score / 10).toFixed(1)}
              </div>
            )}

            <div className="absolute bottom-0 flex w-full flex-col gap-1 px-3 pb-3">
              <h5 className="line-clamp-1 text-sm font-bold text-white">
                {props.title}
              </h5>
              {props.watchDetail && (
                <>
                  <p className="text-xs text-gray-400">
                    Episode {props.watchDetail.episodeNumber} -{" "}
                    {formatSecondsToMMSS(props.watchDetail.current)} /{" "}
                    {formatSecondsToMMSS(props.watchDetail.timestamp)}
                  </p>
                  <Progress value={percentage} />
                </>
              )}
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                {props.episodeCard && !!props.episodes && (
                  <Badge className="rounded-full bg-violet-600 px-1.5 py-0.5 text-[10px] text-white">
                    Ep {props.episodes}
                  </Badge>
                )}
                {props.format && (
                  <Badge className="rounded-full border-0 bg-black/60 px-1.5 py-0.5 text-[10px] text-gray-200 backdrop-blur">
                    {props.format}
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Link>
  );
};

export default AnimeCard;

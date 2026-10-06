import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  icon?: React.ReactNode;
  className?: string;
};

const SectionHeading = ({ eyebrow, title, icon, className }: Props) => {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {eyebrow && (
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-400">
          {eyebrow}
        </span>
      )}
      <h5 className="flex items-center gap-2 text-2xl font-bold text-white">
        {icon}
        {title}
      </h5>
    </div>
  );
};

export default SectionHeading;

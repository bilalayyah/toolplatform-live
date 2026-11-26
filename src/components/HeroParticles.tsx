function PinkCube({className}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" fill="#F9A8D4" />
      <path d="M12 2L21 7L12 12L3 7L12 2Z" fill="#FBCFE8" />
      <path d="M12 12L21 7V17L12 22V12Z" fill="#F472B6" />
    </svg>
  );
}

function SoftTriangle({
  colorClass,
  className,
}: {
  colorClass: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={`${colorClass} ${className ?? ''}`}
    >
      <path d="M9.13 2.5a1 1 0 0 1 1.74 0l7.1 12.5A1 1 0 0 1 17.1 16.5H2.9a1 1 0 0 1-.87-1.5l7.1-12.5Z" />
    </svg>
  );
}

export function HeroParticles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* Top padding shapes (visible on all screen sizes, strictly above H1) */}
      <div className="absolute top-4 left-[9%] sm:left-[14%] animate-hero-float [animation-duration:5.2s] [animation-delay:0s]">
        <span className="block h-2.5 w-2.5 rounded-full bg-teal-400/80 dark:bg-teal-400/55" />
      </div>

      <div className="absolute top-5 right-[10%] sm:right-[15%] animate-hero-float [animation-duration:6s] [animation-delay:0.9s]">
        <SoftTriangle
          colorClass="text-sky-400/80 dark:text-sky-400/55"
          className="h-3 w-3 rotate-18"
        />
      </div>

      <div className="absolute top-3 left-[32%] sm:left-[28%] animate-hero-float [animation-duration:5.8s] [animation-delay:1.6s]">
        <span className="block h-2.5 w-2.5 -rotate-12 rounded-[2px] bg-amber-300/85 dark:bg-amber-300/60" />
      </div>

      <div className="absolute top-6 right-[30%] sm:right-[27%] animate-hero-float [animation-duration:4.9s] [animation-delay:2.1s]">
        <span className="block h-2 w-2 rounded-full bg-orange-400/80 dark:bg-orange-400/55" />
      </div>

      {/* Side shapes beside hero sub-copy & search box (tablet & desktop outer flanks) */}
      <div className="hidden md:block absolute top-[21%] left-[4%] lg:left-[7%] animate-hero-float [animation-duration:6.4s] [animation-delay:0.4s]">
        <PinkCube className="h-[18px] w-[18px] -rotate-12 opacity-85 dark:opacity-65" />
      </div>

      <div className="hidden md:block absolute top-[20%] right-[4%] lg:right-[7%] animate-hero-float [animation-duration:5.6s] [animation-delay:1.3s]">
        <SoftTriangle
          colorClass="text-violet-400/80 dark:text-violet-400/60"
          className="h-4 w-4 rotate-24"
        />
      </div>

      <div className="hidden md:block absolute top-[38%] left-[6%] lg:left-[10%] animate-hero-float [animation-duration:5.4s] [animation-delay:2.4s]">
        <span className="block h-3 w-3 rounded-full bg-orange-400/75 dark:bg-orange-400/55" />
      </div>

      <div className="hidden md:block absolute top-[37%] right-[6%] lg:right-[10%] animate-hero-float [animation-duration:6.2s] [animation-delay:0.7s]">
        <span className="block h-3.5 w-3.5 rotate-16 rounded-[3px] bg-amber-300/85 dark:bg-amber-300/55" />
      </div>

      {/* Side shapes beside search box & outer desktop category cards */}
      <div className="hidden lg:block absolute top-[54%] left-[4%] animate-hero-float [animation-duration:5.9s] [animation-delay:1.8s]">
        <SoftTriangle
          colorClass="text-sky-400/80 dark:text-sky-400/55"
          className="h-3.5 w-3.5 -rotate-22"
        />
      </div>

      <div className="hidden min-[1400px]:block absolute top-[76%] right-[2.5%] animate-hero-float [animation-duration:6.5s] [animation-delay:1.1s]">
        <PinkCube className="h-4 w-4 rotate-12 opacity-85 dark:opacity-65" />
      </div>

      {/* Subtle bottom whitespace below category cards */}
      <div className="hidden lg:block absolute bottom-3 left-[18%] animate-hero-float [animation-duration:5.3s] [animation-delay:2.8s]">
        <SoftTriangle
          colorClass="text-violet-400/75 dark:text-violet-400/55"
          className="h-3 w-3 rotate-30"
        />
      </div>

      <div className="hidden lg:block absolute bottom-3.5 right-[18%] animate-hero-float [animation-duration:5.7s] [animation-delay:1.5s]">
        <span className="block h-2.5 w-2.5 rounded-full bg-teal-400/80 dark:bg-teal-400/55" />
      </div>
    </div>
  );
}

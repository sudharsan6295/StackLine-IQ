"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

interface LiveStatProps {
  value: number;
  label: string;
}

export function LiveStat({ value, label }: LiveStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const controls = animate(0, value, {
      duration: prefersReducedMotion ? 0 : 0.5,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <motion.div ref={ref} className="flex flex-col">
      <span className="font-data text-2xl font-bold tabular-nums sm:text-3xl">
        {display}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </motion.div>
  );
}

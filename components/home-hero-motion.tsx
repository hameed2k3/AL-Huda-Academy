"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function HeroTextGroup({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.85, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function HeroVisual({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
      animate={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.95, delay: 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

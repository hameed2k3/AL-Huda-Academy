"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function MotionReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0 : 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

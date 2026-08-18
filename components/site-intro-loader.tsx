"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const PHRASE_WORDS = ["بسم", "الله", "الرحمن", "الرحيم"];

export function SiteIntroLoader() {
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("intro-lock");

    const timeout = window.setTimeout(
      () => {
        setIsVisible(false);
        root.classList.remove("intro-lock");
      },
      reduceMotion ? 1400 : 3200,
    );

    return () => {
      window.clearTimeout(timeout);
      root.classList.remove("intro-lock");
    };
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          key="site-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: reduceMotion ? 0.25 : 0.65 } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="pointer-events-none absolute inset-0 islamic-glow opacity-80" />
          <div className="pointer-events-none absolute inset-0 pattern-stars opacity-30" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 text-center"
          >
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={reduceMotion ? {} : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="rounded-[2rem] border border-accent/20 bg-surface/80 px-8 py-10 shadow-[0_24px_70px_-36px_rgba(15,81,50,0.35)] backdrop-blur-sm sm:px-12"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-accent">
                Opening invocation
              </p>
              <div
                dir="rtl"
                className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
              >
                {PHRASE_WORDS.map((word, index) => (
                  <motion.span
                    key={word}
                    initial={reduceMotion ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
                    animate={reduceMotion ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      delay: reduceMotion ? 0 : 0.32 + index * 0.36,
                      duration: reduceMotion ? 0 : 0.6,
                      ease: "easeOut",
                    }}
                    className="font-arabic text-4xl text-primary sm:text-5xl lg:text-6xl"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scaleX: 0.6 }}
                animate={reduceMotion ? {} : { opacity: 1, scaleX: 1 }}
                transition={{ delay: reduceMotion ? 0 : 1.9, duration: 0.5 }}
                className="gold-divider mx-auto mt-6 h-px w-32 origin-center"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

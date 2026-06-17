"use client"

import { motion } from "framer-motion"
import { Sparkles as SparklesIcon } from "lucide-react"
import { suggestionPrompts } from "@/lib/sample-data"
import { springs, logoEntrance, staggerContainer, staggerItem } from "@/lib/motion"

export function ChatWelcome({
  onPick,
}: {
  onPick: (prompt: string) => void
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-2 py-10">
      <motion.div
        variants={logoEntrance}
        initial="hidden"
        animate="visible"
        className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg glass-inner-glow"
      >
        <SparklesIcon className="size-8" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, ...springs.gentle }}
        className="mb-2 text-center text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl"
      >
        How can I help you today?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, ...springs.gentle }}
        className="mb-10 text-center text-sm text-muted-foreground text-pretty"
      >
        Ask a question, paste some code, or drop a file to get started.
      </motion.p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {suggestionPrompts.map((s, i) => (
          <motion.button
            key={s.title}
            type="button"
            onClick={() => onPick(s.prompt)}
            variants={staggerItem}
            whileHover={{
              y: -4,
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08), 0 4px 10px -4px rgba(0,0,0,0.03)",
              borderColor: "rgba(var(--primary), 0.3)",
              transition: springs.gentle
            }}
            whileTap={{ scale: 0.98, transition: springs.snappy }}
            className="group glass glass-border glass-shadow flex flex-col gap-1.5 rounded-2xl p-5 text-left transition-colors"
          >
            <span className="text-sm font-semibold text-foreground">{s.title}</span>
            <span className="text-sm text-muted-foreground text-pretty leading-relaxed">
              {s.subtitle}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import { shimmer } from "@/lib/motion"

export function MessageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="flex gap-3 sm:gap-4"
    >
      {/* Avatar skeleton */}
      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted">
        <motion.div
          variants={shimmer}
          animate="animate"
          className="size-4 rounded-md bg-primary/20"
        />
      </div>

      {/* Content skeleton */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="glass glass-border rounded-2xl rounded-tl-sm px-5 py-4">
          {/* Title line */}
          <motion.div
            variants={shimmer}
            animate="animate"
            className="h-4 w-3/4 rounded-md bg-muted"
          />

          {/* Text lines */}
          <div className="mt-3 space-y-2">
            <motion.div
              variants={shimmer}
              animate="animate"
              className="h-3 w-full rounded-md bg-muted"
            />
            <motion.div
              variants={shimmer}
              animate="animate"
              className="h-3 w-5/6 rounded-md bg-muted"
            />
            <motion.div
              variants={shimmer}
              animate="animate"
              className="h-3 w-4/6 rounded-md bg-muted"
            />
          </div>

          {/* Code block skeleton */}
          <motion.div
            variants={shimmer}
            animate="animate"
            className="mt-4 h-24 w-full rounded-xl bg-muted"
          />
        </div>
      </div>
    </motion.div>
  )
}

export function MessageSkeletonGroup({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
            delay: i * 0.1
          }}
        >
          <MessageSkeleton />
        </motion.div>
      ))}
    </div>
  )
}

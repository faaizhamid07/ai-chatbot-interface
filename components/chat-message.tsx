"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles as SparklesIcon, Copy as CopyIcon, Check as CheckIcon, ThumbsUp as ThumbsUpIcon, ThumbsDown as ThumbsDownIcon, RotateCcw as RotateCcwIcon, FileText as FileTextIcon } from "lucide-react"
import type { Message } from "@/lib/chat-types"
import { cn } from "@/lib/utils"
import { springs, messageBubble, typingDot } from "@/lib/motion"
import { Markdown } from "./markdown"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function ActionButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <motion.button
            type="button"
            onClick={onClick}
            aria-label={label}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snappy}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            {children}
          </motion.button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export function ChatMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === "user"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // ignore
    }
  }

  if (isUser) {
    return (
      <motion.div
        variants={messageBubble}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        className="flex justify-end"
      >
        <div className="flex max-w-[85%] flex-col items-end gap-2 sm:max-w-[75%]">
          {message.attachments && message.attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springs.gentle}
              className="flex flex-wrap justify-end gap-2"
            >
              {message.attachments.map((att, i) => (
                <motion.div
                  key={att.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...springs.snappy, delay: i * 0.05 }}
                  className="glass glass-border flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
                >
                  <FileTextIcon className="size-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="max-w-40 truncate text-xs font-medium text-foreground">
                      {att.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatSize(att.size)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          {message.content && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={springs.gentle}
              className="glass glass-border glass-shadow rounded-2xl rounded-br-sm px-4 py-3 text-[0.9375rem] leading-relaxed text-foreground"
            >
              <p className="whitespace-pre-wrap text-pretty">{message.content}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={messageBubble}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="group/message flex gap-3 sm:gap-4"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={springs.bouncy}
        className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm glass-inner-glow"
      >
        <SparklesIcon className="size-4" />
      </motion.div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springs.gentle}
          className="glass glass-border glass-shadow rounded-2xl rounded-tl-sm px-5 py-4"
        >
          <Markdown content={message.content} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, ...springs.gentle }}
          className="flex items-center gap-0.5 pt-0.5 opacity-0 transition-opacity duration-200 group-hover/message:opacity-100 focus-within:opacity-100"
        >
          <ActionButton label={copied ? "Copied" : "Copy"} onClick={handleCopy}>
            {copied ? (
              <CheckIcon className="size-4 text-primary" />
            ) : (
              <CopyIcon className="size-4" />
            )}
          </ActionButton>
          <ActionButton label="Good response">
            <ThumbsUpIcon className="size-4" />
          </ActionButton>
          <ActionButton label="Bad response">
            <ThumbsDownIcon className="size-4" />
          </ActionButton>
          <ActionButton label="Regenerate">
            <RotateCcwIcon className="size-4" />
          </ActionButton>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={springs.gentle}
      className="flex gap-3 sm:gap-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={springs.bouncy}
        className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm glass-inner-glow"
      >
        <SparklesIcon className="size-4" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={springs.gentle}
        className="glass glass-border rounded-2xl rounded-tl-sm px-5 py-4"
      >
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              custom={i}
              variants={typingDot}
              animate="animate"
              className="size-2 rounded-full bg-primary"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

"use client"

import { useState } from "react"
import {
  SparklesIcon,
  CopyIcon,
  CheckIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  RotateCcwIcon,
  FileTextIcon,
} from "lucide-react"
import type { Message } from "@/lib/chat-types"
import { cn } from "@/lib/utils"
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
          <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {children}
          </button>
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
      <div className="flex animate-in fade-in slide-in-from-bottom-2 justify-end duration-300">
        <div className="flex max-w-[85%] flex-col items-end gap-2 sm:max-w-[75%]">
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap justify-end gap-2">
              {message.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
                >
                  <FileTextIcon className="size-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="max-w-40 truncate text-xs font-medium">
                      {att.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatSize(att.size)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {message.content && (
            <div className="rounded-2xl rounded-br-md bg-secondary px-4 py-2.5 text-[0.9375rem] leading-relaxed text-secondary-foreground">
              <p className="whitespace-pre-wrap text-pretty">{message.content}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="group/message flex animate-in fade-in slide-in-from-bottom-2 gap-3 duration-300 sm:gap-4">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <SparklesIcon className="size-4" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Markdown content={message.content} />
        <div className="flex items-center gap-0.5 pt-1 opacity-0 transition-opacity group-hover/message:opacity-100 focus-within:opacity-100">
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
        </div>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex animate-in fade-in gap-3 duration-300 sm:gap-4">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <SparklesIcon className="size-4" />
      </div>
      <div className="flex items-center gap-1.5 pt-2.5">
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <span className="size-2 animate-bounce rounded-full bg-muted-foreground" />
      </div>
    </div>
  )
}

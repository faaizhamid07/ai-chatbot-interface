"use client"

import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Check as CheckIcon, Copy as CopyIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  language: string
  value: string
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="group/code my-4 overflow-hidden rounded-2xl border border-border/50 bg-muted/40 backdrop-blur-xl text-sm shadow-sm">
      <div className="glass-inner-glow flex items-center justify-between border-b border-border/50 bg-card/50 px-4 py-2.5">
        <span className="font-mono text-xs font-medium text-muted-foreground">
          {language || "text"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-all hover:bg-card hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <CheckIcon className="size-3.5 text-primary" />
              <span className="font-medium text-primary">Copied</span>
            </>
          ) : (
            <>
              <CopyIcon className="size-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={oneDark}
        customStyle={{
          margin: 0,
          background: "transparent",
          padding: "1rem",
          fontSize: "0.8125rem",
          lineHeight: 1.7,
        }}
        codeTagProps={{
          style: { fontFamily: "var(--font-mono)" },
        }}
        wrapLongLines
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}

export function InlineCode({ className, children, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "rounded-lg bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  )
}

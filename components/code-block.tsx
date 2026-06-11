"use client"

import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { CheckIcon, CopyIcon } from "lucide-react"
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
    <div className="group/code my-4 overflow-hidden rounded-xl border border-border bg-[oklch(0.18_0.006_56)] text-sm">
      <div className="flex items-center justify-between border-b border-border/70 bg-secondary/50 px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">
          {language || "text"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <CheckIcon className="size-3.5 text-primary" />
              Copied
            </>
          ) : (
            <>
              <CopyIcon className="size-3.5" />
              Copy
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
          lineHeight: 1.6,
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
        "rounded-md border border-border/60 bg-secondary/70 px-1.5 py-0.5 font-mono text-[0.85em] text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  )
}

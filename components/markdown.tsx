"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CodeBlock, InlineCode } from "./code-block"
import { cn } from "@/lib/utils"

export function Markdown({ content }: { content: string }) {
  return (
    <div
      className={cn(
        "max-w-none text-[0.9375rem] leading-relaxed text-foreground",
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-6 mb-3 text-xl font-semibold tracking-tight text-balance">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-6 mb-3 text-lg font-semibold tracking-tight text-balance">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-5 mb-2 text-base font-semibold tracking-tight">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-pretty">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-1 flex list-none flex-col gap-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-5 flex list-decimal flex-col gap-2 marker:text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => {
            const ordered = (props as { node?: { parent?: { tagName?: string } } })
            const isOrdered = ordered.node?.parent?.tagName === "ol"
            return (
              <li className="leading-relaxed">
                {!isOrdered && (
                  <span className="mr-2 inline-block size-1.5 -translate-y-0.5 rounded-full bg-primary align-middle" />
                )}
                {children}
              </li>
            )
          },
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:decoration-primary"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-primary/60 pl-4 text-muted-foreground italic">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          hr: () => <hr className="my-6 border-border" />,
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-secondary/50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-border px-4 py-2 text-left font-medium">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border/60 px-4 py-2 align-top">
              {children}
            </td>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "")
            const isBlock = className?.includes("language-")
            if (isBlock) {
              return (
                <CodeBlock
                  language={match?.[1] ?? "text"}
                  value={String(children).replace(/\n$/, "")}
                />
              )
            }
            return <InlineCode {...props}>{children}</InlineCode>
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

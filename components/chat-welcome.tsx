"use client"

import { SparklesIcon } from "lucide-react"
import { suggestionPrompts } from "@/lib/sample-data"

export function ChatWelcome({
  onPick,
}: {
  onPick: (prompt: string) => void
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-2 py-10">
      <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm animate-in fade-in zoom-in-95 duration-500">
        <SparklesIcon className="size-7" />
      </div>
      <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight text-balance sm:text-3xl animate-in fade-in slide-in-from-bottom-2 duration-500">
        How can I help you today?
      </h1>
      <p className="mb-8 text-center text-sm text-muted-foreground text-pretty animate-in fade-in slide-in-from-bottom-2 duration-700">
        Ask a question, paste some code, or drop a file to get started.
      </p>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestionPrompts.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => onPick(s.prompt)}
            style={{ animationDelay: `${150 + i * 80}ms` }}
            className="group flex animate-in fade-in slide-in-from-bottom-3 flex-col gap-1 rounded-xl border border-border bg-card p-4 text-left transition-all duration-300 hover:border-primary/40 hover:bg-accent fill-mode-both"
          >
            <span className="text-sm font-medium text-foreground">{s.title}</span>
            <span className="text-sm text-muted-foreground text-pretty">
              {s.subtitle}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

"use client"

import { Sparkles as SparklesIcon } from "lucide-react"
import { suggestionPrompts } from "@/lib/sample-data"

export function ChatWelcome({
  onPick,
}: {
  onPick: (prompt: string) => void
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-2 py-10">
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg animate-in fade-in zoom-in-95 duration-500 glass-inner-glow">
        <SparklesIcon className="size-8" />
      </div>
      <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl animate-in fade-in slide-in-from-bottom-2 duration-500">
        How can I help you today?
      </h1>
      <p className="mb-10 text-center text-sm text-muted-foreground text-pretty animate-in fade-in slide-in-from-bottom-2 duration-700">
        Ask a question, paste some code, or drop a file to get started.
      </p>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestionPrompts.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => onPick(s.prompt)}
            style={{ animationDelay: `${150 + i * 80}ms` }}
            className="group glass glass-border glass-shadow flex animate-in fade-in slide-in-from-bottom-3 flex-col gap-1.5 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 fill-mode-both"
          >
            <span className="text-sm font-semibold text-foreground">{s.title}</span>
            <span className="text-sm text-muted-foreground text-pretty leading-relaxed">
              {s.subtitle}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

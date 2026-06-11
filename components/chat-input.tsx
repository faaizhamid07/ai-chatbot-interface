"use client"

import { useRef, useState } from "react"
import {
  ArrowUpIcon,
  PaperclipIcon,
  XIcon,
  FileTextIcon,
  ImageIcon,
} from "lucide-react"
import type { Attachment } from "@/lib/chat-types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  onSend: (text: string, attachments: Attachment[]) => void
  disabled?: boolean
}

let idCounter = 0
function makeId() {
  idCounter += 1
  return `att-${Date.now()}-${idCounter}`
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [dragging, setDragging] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)

  const addFiles = (files: FileList | File[]) => {
    const next: Attachment[] = Array.from(files).map((f) => ({
      id: makeId(),
      name: f.name,
      size: f.size,
      type: f.type,
    }))
    if (next.length) setAttachments((prev) => [...prev, ...next])
  }

  const handleSubmit = () => {
    const trimmed = value.trim()
    if ((!trimmed && attachments.length === 0) || disabled) return
    onSend(trimmed, attachments)
    setValue("")
    setAttachments([])
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const el = e.target
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current += 1
    if (e.dataTransfer.items?.length) setDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current -= 1
    if (dragCounter.current <= 0) setDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current = 0
    setDragging(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }

  const isImage = (type: string) => type.startsWith("image/")

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-2xl border bg-card shadow-sm transition-colors",
          dragging ? "border-primary border-dashed bg-primary/5" : "border-border",
        )}
      >
        {dragging && (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-card/90 backdrop-blur-sm">
            <PaperclipIcon className="size-5 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Drop files to attach
            </p>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pt-3">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="group/att flex items-center gap-2 rounded-lg border border-border bg-secondary/60 py-1.5 pr-1.5 pl-2.5"
              >
                <span className="flex size-7 items-center justify-center rounded-md bg-primary/15 text-primary">
                  {isImage(att.type) ? (
                    <ImageIcon className="size-3.5" />
                  ) : (
                    <FileTextIcon className="size-3.5" />
                  )}
                </span>
                <div className="flex flex-col">
                  <span className="max-w-36 truncate text-xs font-medium">
                    {att.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatSize(att.size)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setAttachments((prev) => prev.filter((a) => a.id !== att.id))
                  }
                  aria-label={`Remove ${att.name}`}
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 p-2.5">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files)
              e.target.value = ""
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach file"
          >
            <PaperclipIcon className="size-5" />
          </Button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Message Lumen..."
            className="max-h-[200px] min-h-9 flex-1 resize-none self-center bg-transparent py-1.5 text-[0.9375rem] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          <Button
            type="button"
            size="icon"
            className="size-9 shrink-0 rounded-lg"
            onClick={handleSubmit}
            disabled={(!value.trim() && attachments.length === 0) || disabled}
            aria-label="Send message"
          >
            <ArrowUpIcon className="size-5" />
          </Button>
        </div>
      </div>
      <p className="px-2 pt-2 text-center text-xs text-muted-foreground">
        Lumen can make mistakes. Consider checking important information.
      </p>
    </div>
  )
}

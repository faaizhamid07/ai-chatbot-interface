"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp as ArrowUpIcon, Paperclip as PaperclipIcon, X as XIcon, FileText as FileTextIcon, Image as ImageIcon } from "lucide-react"
import type { Attachment } from "@/lib/chat-types"
import { cn } from "@/lib/utils"
import { springs, fadeScale, attachmentEnter } from "@/lib/motion"
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.gentle}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "glass glass-border glass-shadow-lg relative rounded-2xl transition-colors duration-200",
          dragging ? "border-primary border-dashed bg-primary/10 ring-2 ring-primary/20" : "",
        )}
      >
        <AnimatePresence>
          {dragging && (
            <motion.div
              variants={fadeScale}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 rounded-2xl glass-strong"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={springs.bouncy}
              >
                <PaperclipIcon className="size-6 text-primary" />
              </motion.div>
              <p className="text-sm font-medium text-foreground">
                Drop files to attach
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={springs.gentle}
              className="flex flex-wrap gap-2 p-3 pb-0"
            >
              {attachments.map((att, i) => (
                <motion.div
                  key={att.id}
                  variants={attachmentEnter}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="group/att glass glass-inner-glow flex items-center gap-2.5 rounded-xl py-2 pr-2 pl-3"
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    {isImage(att.type) ? (
                      <ImageIcon className="size-4" />
                    ) : (
                      <FileTextIcon className="size-4" />
                    )}
                  </span>
                  <div className="flex flex-col">
                    <span className="max-w-40 truncate text-xs font-medium text-foreground">
                      {att.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatSize(att.size)}
                    </span>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() =>
                      setAttachments((prev) => prev.filter((a) => a.id !== att.id))
                    }
                    aria-label={`Remove ${att.name}`}
                    whileHover={{ scale: 1.1, backgroundColor: "rgb(var(--card))" }}
                    whileTap={{ scale: 0.95 }}
                    transition={springs.snappy}
                    className="flex size-7 items-center justify-center rounded-lg text-muted-foreground"
                  >
                    <XIcon className="size-4" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2 p-3">
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snappy}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-10 shrink-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach file"
            >
              <PaperclipIcon className="size-5" />
            </Button>
          </motion.div>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Message Claudium..."
            className="max-h-[200px] min-h-10 flex-1 resize-none self-center bg-transparent py-2 text-[0.9375rem] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snappy}
          >
            <Button
              type="button"
              size="icon"
              className="size-10 shrink-0 rounded-xl"
              onClick={handleSubmit}
              disabled={(!value.trim() && attachments.length === 0) || disabled}
              aria-label="Send message"
            >
              <ArrowUpIcon className="size-5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="px-2 pt-2.5 text-center text-xs text-muted-foreground/70"
      >
        Claudium can make mistakes. Consider checking important information.
      </motion.p>
    </div>
  )
}

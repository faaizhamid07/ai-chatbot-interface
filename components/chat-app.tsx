"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PanelLeft as PanelLeftIcon, SquarePen as SquarePenIcon } from "lucide-react"
import type { Attachment, Conversation } from "@/lib/chat-types"
import { sampleConversations } from "@/lib/sample-data"
import { generateReply, makeMessage } from "@/lib/generate-reply"
import { cn } from "@/lib/utils"
import { springs, fadeSlideIn, fadeScale } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ChatSidebar } from "./chat-sidebar"
import { ChatMessage, TypingIndicator } from "./chat-message"
import { ChatInput } from "./chat-input"
import { ChatWelcome } from "./chat-welcome"

export function ChatApp() {
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [thinking, setThinking] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null
  const messages = activeConversation?.messages ?? []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, thinking])

  const handleNewChat = () => {
    setActiveId(null)
    setMobileOpen(false)
  }

  const handleSelect = (id: string) => {
    setActiveId(id)
    setMobileOpen(false)
  }

  const handleDelete = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const handleSend = (text: string, attachments: Attachment[]) => {
    if (thinking) return
    const userMsg = makeMessage("user", text, attachments.length ? attachments : undefined)

    let convId = activeId
    if (!convId) {
      convId = `conv-${Date.now()}`
      const title = text.slice(0, 40) || attachments[0]?.name || "New chat"
      const newConv: Conversation = {
        id: convId,
        title,
        messages: [userMsg],
        updatedAt: Date.now(),
      }
      setConversations((prev) => [newConv, ...prev])
      setActiveId(convId)
    } else {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: [...c.messages, userMsg], updatedAt: Date.now() }
            : c,
        ),
      )
    }

    setThinking(true)

const targetId = convId

fetch(
  `http://127.0.0.1:8000/chat?message=${encodeURIComponent(text)}`
)
  .then((res) => res.json())
  .then((data) => {

    const reply = makeMessage(
      "assistant",
      data.reply
    )

    setConversations((prev) =>
      prev.map((c) =>
        c.id === targetId
          ? {
              ...c,
              messages: [...c.messages, reply],
              updatedAt: Date.now(),
            }
          : c,
      ),
    )
  })
  .catch((err) => {
    console.error(err)

    const reply = makeMessage(
      "assistant",
      "Error contacting backend."
    )

    setConversations((prev) =>
      prev.map((c) =>
        c.id === targetId
          ? {
              ...c,
              messages: [...c.messages, reply],
              updatedAt: Date.now(),
            }
          : c,
      ),
    )
  })
  .finally(() => {
    setThinking(false)
  })
  }

  const sidebar = (showCollapse: boolean) => (
    <ChatSidebar
      conversations={conversations}
      activeId={activeId}
      onSelect={handleSelect}
      onNewChat={handleNewChat}
      onDelete={handleDelete}
      onCollapse={() => setSidebarOpen(false)}
      showCollapse={showCollapse}
    />
  )

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      {/* Desktop sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={springs.smooth}
            className="hidden shrink-0 overflow-hidden md:block"
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={springs.smooth}
              className="glass-sidebar glass-shadow h-full w-72"
            >
              {sidebar(true)}
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" showCloseButton={false} className="glass-strong w-72 max-w-72 p-0">
          <SheetTitle className="sr-only">Conversation history</SheetTitle>
          {sidebar(false)}
        </SheetContent>
      </Sheet>

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        <motion.header
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={springs.gentle}
          className="glass glass-inner-glow sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border/50 px-3 sm:px-4"
        >
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <PanelLeftIcon className="size-5" />
          </Button>
          <AnimatePresence>
            {!sidebarOpen && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={springs.snappy}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden size-9 text-muted-foreground hover:text-foreground md:flex"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar"
                >
                  <PanelLeftIcon className="size-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.h2
            key={activeConversation?.title ?? "New chat"}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springs.gentle}
            className="min-w-0 flex-1 truncate text-sm font-medium text-foreground"
          >
            {activeConversation?.title ?? "New chat"}
          </motion.h2>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground"
            onClick={handleNewChat}
            aria-label="New chat"
          >
            <SquarePenIcon className="size-5" />
          </Button>
        </motion.header>

        <AnimatePresence mode="wait">
          {messages.length === 0 && !thinking ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <ChatWelcome onPick={(prompt) => handleSend(prompt, [])} />
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, ...springs.gentle }}
                className="px-3 pb-4 sm:px-4"
              >
                <ChatInput onSend={handleSend} disabled={thinking} />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex min-h-0 flex-1 flex-col"
            >
              <ScrollArea className="min-h-0 flex-1">
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
                  <AnimatePresence initial={false}>
                    {messages.map((m) => (
                      <ChatMessage key={m.id} message={m} />
                    ))}
                  </AnimatePresence>
                  <AnimatePresence>
                    {thinking && <TypingIndicator />}
                  </AnimatePresence>
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={springs.gentle}
                className="shrink-0 px-3 pb-4 sm:px-4"
              >
                <ChatInput onSend={handleSend} disabled={thinking} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { PanelLeftIcon, SquarePenIcon } from "lucide-react"
import type { Attachment, Conversation } from "@/lib/chat-types"
import { sampleConversations } from "@/lib/sample-data"
import { generateReply, makeMessage } from "@/lib/generate-reply"
import { cn } from "@/lib/utils"
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
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 border-r border-sidebar-border transition-[width] duration-300 ease-in-out md:block",
          sidebarOpen ? "w-72" : "w-0",
        )}
      >
        <div className={cn("h-full w-72", !sidebarOpen && "pointer-events-none opacity-0")}>
          {sidebar(true)}
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" showCloseButton={false} className="w-72 max-w-72 p-0">
          <SheetTitle className="sr-only">Conversation history</SheetTitle>
          {sidebar(false)}
        </SheetContent>
      </Sheet>

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3 sm:px-4">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <PanelLeftIcon className="size-5" />
          </Button>
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden size-9 text-muted-foreground hover:text-foreground md:flex"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <PanelLeftIcon className="size-5" />
            </Button>
          )}
          <h2 className="min-w-0 flex-1 truncate text-sm font-medium">
            {activeConversation?.title ?? "New chat"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground"
            onClick={handleNewChat}
            aria-label="New chat"
          >
            <SquarePenIcon className="size-5" />
          </Button>
        </header>

        {messages.length === 0 && !thinking ? (
          <div className="flex flex-1 flex-col overflow-hidden">
            <ChatWelcome onPick={(prompt) => handleSend(prompt, [])} />
            <div className="px-3 pb-4 sm:px-4">
              <ChatInput onSend={handleSend} disabled={thinking} />
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="min-h-0 flex-1">
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
                {messages.map((m) => (
                  <ChatMessage key={m.id} message={m} />
                ))}
                {thinking && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>
            <div className="shrink-0 px-3 pb-4 sm:px-4">
              <ChatInput onSend={handleSend} disabled={thinking} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

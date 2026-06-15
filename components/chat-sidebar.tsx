"use client"

import { useMemo } from "react"
import { MessageSquarePlus as MessageSquarePlusIcon, PanelLeftClose as PanelLeftCloseIcon, Search as SearchIcon, MoveHorizontal as MoreHorizontalIcon, Trash2 as Trash2Icon, PencilLine as PencilLineIcon, Sparkles as SparklesIcon } from "lucide-react"
import type { Conversation } from "@/lib/chat-types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChatSidebarProps {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onNewChat: () => void
  onDelete: (id: string) => void
  onCollapse?: () => void
  showCollapse?: boolean
}

function groupByDate(conversations: Conversation[]) {
  const now = Date.now()
  const day = 1000 * 60 * 60 * 24
  const groups: { label: string; items: Conversation[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Previous 7 days", items: [] },
    { label: "Older", items: [] },
  ]
  for (const c of conversations) {
    const age = now - c.updatedAt
    if (age < day) groups[0].items.push(c)
    else if (age < day * 2) groups[1].items.push(c)
    else if (age < day * 7) groups[2].items.push(c)
    else groups[3].items.push(c)
  }
  return groups.filter((g) => g.items.length > 0)
}

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  onCollapse,
  showCollapse,
}: ChatSidebarProps) {
  const grouped = useMemo(
    () => groupByDate([...conversations].sort((a, b) => b.updatedAt - a.updatedAt)),
    [conversations],
  )

  return (
    <div className="flex h-full w-full flex-col text-sidebar-foreground">
      <div className="flex items-center justify-between gap-2 px-3 py-3.5">
        <div className="flex items-center gap-2.5 pl-1">
          <div className="glass-inner-glow flex size-8 items-center justify-center rounded-xl bg-primary shadow-sm">
            <SparklesIcon className="size-4.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">Claudium</span>
        </div>
        {showCollapse && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            onClick={onCollapse}
            aria-label="Collapse sidebar"
          >
            <PanelLeftCloseIcon className="size-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 px-3 pb-2">
        <Button
          onClick={onNewChat}
          className="glass glass-border w-full justify-start gap-2 rounded-xl font-medium spring-bounce hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageSquarePlusIcon className="size-4" />
          New chat
        </Button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-card hover:text-foreground"
        >
          <SearchIcon className="size-4" />
          Search chats
        </button>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-2">
        <div className="flex flex-col gap-4 py-3">
          {grouped.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                {group.label}
              </p>
              {group.items.map((conv) => {
                const isActive = conv.id === activeId
                return (
                  <div
                    key={conv.id}
                    className={cn(
                      "group/item relative flex items-center rounded-xl transition-all duration-200",
                      isActive
                        ? "glass glass-shadow-sm text-foreground"
                        : "hover:bg-card/60",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(conv.id)}
                      className="flex min-w-0 flex-1 items-center px-3 py-2.5 text-left"
                    >
                      <span className="truncate text-sm">{conv.title}</span>
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <button
                            type="button"
                            aria-label="Conversation options"
                            className={cn(
                              "mr-1.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground focus-visible:opacity-100 group-hover/item:opacity-100",
                              isActive && "opacity-100",
                            )}
                          >
                            <MoreHorizontalIcon className="size-4" />
                          </button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <PencilLineIcon className="size-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => onDelete(conv.id)}
                          >
                            <Trash2Icon className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-border/50 p-3">
        <button
          type="button"
          className="glass glass-border flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-all hover:bg-card"
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            A
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">Alex Morgan</span>
            <span className="truncate text-xs text-muted-foreground">Free plan</span>
          </div>
        </button>
      </div>
    </div>
  )
}

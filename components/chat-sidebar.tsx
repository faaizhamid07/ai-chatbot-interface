"use client"

import { useMemo } from "react"
import {
  MessageSquarePlusIcon,
  PanelLeftCloseIcon,
  SearchIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  PencilLineIcon,
  SparklesIcon,
} from "lucide-react"
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
    <div className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between gap-2 px-3 py-3.5">
        <div className="flex items-center gap-2 pl-1">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <SparklesIcon className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Lumen</span>
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
          className="w-full justify-start gap-2 rounded-lg font-medium"
        >
          <MessageSquarePlusIcon className="size-4" />
          New chat
        </Button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <SearchIcon className="size-4" />
          Search chats
        </button>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-2">
        <div className="flex flex-col gap-4 py-3">
          {grouped.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5">
              <p className="px-3 pb-1 text-xs font-medium text-muted-foreground/70">
                {group.label}
              </p>
              {group.items.map((conv) => {
                const isActive = conv.id === activeId
                return (
                  <div
                    key={conv.id}
                    className={cn(
                      "group/item relative flex items-center rounded-lg transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/60",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(conv.id)}
                      className="flex min-w-0 flex-1 items-center px-3 py-2 text-left"
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
                              "mr-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-sidebar-accent-foreground/10 hover:text-foreground focus-visible:opacity-100 group-hover/item:opacity-100",
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

      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-sidebar-accent"
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground">
            A
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">Alex Morgan</span>
            <span className="truncate text-xs text-muted-foreground">Free plan</span>
          </div>
        </button>
      </div>
    </div>
  )
}

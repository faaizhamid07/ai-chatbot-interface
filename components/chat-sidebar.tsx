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
import { useTheme } from "@/components/theme-provider"
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
  const { theme } = useTheme()
  const isGlass = theme === 'glass'

  return (
    <div className={cn(
      "flex h-full w-full flex-col text-sidebar-foreground transition-all duration-300",
      isGlass 
        ? "bg-sidebar backdrop-blur-xl border border-white/10 rounded-2xl" 
        : "bg-sidebar"
    )}>
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <div className="flex items-center gap-3 pl-1">
          <div className={cn(
            "flex size-8 items-center justify-center font-semibold text-primary-foreground transition-all",
            isGlass 
              ? "rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30" 
              : "rounded-md bg-primary"
          )}>
            <SparklesIcon className="size-4" />
          </div>
          <span className="text-sm font-bold tracking-tight">Claudium</span>
        </div>
        {showCollapse && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-8",
              isGlass && "hover:bg-white/10 hover:text-foreground"
            )}
            onClick={onCollapse}
            aria-label="Collapse sidebar"
          >
            <PanelLeftCloseIcon className="size-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 px-4 pb-3">
        <Button
          onClick={onNewChat}
          className={cn(
            "w-full justify-start gap-2 rounded-lg font-medium transition-all",
            isGlass 
              ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/30 text-white" 
              : ""
          )}
        >
          <MessageSquarePlusIcon className="size-4" />
          New chat
        </Button>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
            isGlass
              ? "text-foreground/60 hover:bg-white/10 hover:text-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <SearchIcon className="size-4" />
          Search chats
        </button>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-2">
        <div className="flex flex-col gap-4 py-3">
          {grouped.map((group, idx) => (
            <div key={group.label} className={isGlass ? `glass-fade-in` : ""} style={isGlass ? { animationDelay: `${idx * 50}ms` } : {}}>
              <p className="px-3 pb-1 text-xs font-medium text-muted-foreground/70">
                {group.label}
              </p>
              {group.items.map((conv, itemIdx) => {
                const isActive = conv.id === activeId
                return (
                  <div
                    key={conv.id}
                    className={cn(
                      "group/item relative flex items-center rounded-lg transition-all",
                      isGlass
                        ? isActive
                          ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur border border-white/20 text-foreground"
                          : "hover:bg-white/10"
                        : isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/60",
                    )}
                    style={isGlass ? { animationDelay: `${(idx * 5 + itemIdx * 30)}ms` } : {}}
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
                              "mr-1 flex size-7 shrink-0 items-center justify-center rounded-md opacity-0 transition-all hover:text-foreground focus-visible:opacity-100 group-hover/item:opacity-100",
                              isGlass
                                ? "text-foreground/40 hover:bg-white/20"
                                : "text-muted-foreground hover:bg-sidebar-accent-foreground/10"
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

      <div className={cn(
        "p-3 transition-all",
        isGlass
          ? "border-t border-white/10"
          : "border-t border-sidebar-border"
      )}>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-all",
            isGlass
              ? "hover:bg-white/10"
              : "hover:bg-sidebar-accent"
          )}
        >
          <div className={cn(
            "flex size-8 items-center justify-center rounded-full text-sm font-medium",
            isGlass
              ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
              : "bg-secondary text-secondary-foreground"
          )}>
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

"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { MessageSquarePlus as MessageSquarePlusIcon, PanelLeftClose as PanelLeftCloseIcon, Search as SearchIcon, MoveHorizontal as MoreHorizontalIcon, Trash2 as Trash2Icon, PencilLine as PencilLineIcon, Sparkles as SparklesIcon } from "lucide-react"
import type { Conversation } from "@/lib/chat-types"
import { cn } from "@/lib/utils"
import { springs, staggerContainer, staggerItem } from "@/lib/motion"
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
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={springs.gentle}
        className="flex items-center justify-between gap-2 px-3 py-3.5"
      >
        <div className="flex items-center gap-2.5 pl-1">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={springs.bouncy}
            className="glass-inner-glow flex size-8 items-center justify-center rounded-xl bg-primary shadow-sm"
          >
            <SparklesIcon className="size-4.5 text-primary-foreground" />
          </motion.div>
          <span className="text-sm font-semibold tracking-tight text-foreground">Claudium</span>
        </div>
        {showCollapse && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snappy}
          >
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              onClick={onCollapse}
              aria-label="Collapse sidebar"
            >
              <PanelLeftCloseIcon className="size-4" />
            </Button>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ...springs.gentle }}
        className="flex flex-col gap-2 px-3 pb-2"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={springs.snappy}
        >
          <Button
            onClick={onNewChat}
            className="glass glass-border w-full justify-start gap-2 rounded-xl font-medium"
          >
            <MessageSquarePlusIcon className="size-4" />
            New chat
          </Button>
        </motion.div>
        <motion.button
          type="button"
          whileHover={{ x: 2 }}
          transition={springs.gentle}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
        >
          <SearchIcon className="size-4" />
          Search chats
        </motion.button>
      </motion.div>

      <ScrollArea className="min-h-0 flex-1 px-2">
        <div className="flex flex-col gap-4 py-3">
          {grouped.map((group, groupIndex) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + groupIndex * 0.08, ...springs.gentle }}
              className="flex flex-col gap-1"
            >
              <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                {group.label}
              </p>
              {group.items.map((conv, itemIndex) => {
                const isActive = conv.id === activeId
                return (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: itemIndex * 0.03, ...springs.gentle }}
                    layout
                    layoutId={isActive ? "active-conversation" : undefined}
                    className={cn(
                      "group/item relative flex items-center rounded-xl transition-colors duration-200",
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
                          <motion.button
                            type="button"
                            aria-label="Conversation options"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={springs.snappy}
                            className={cn(
                              "mr-1.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-opacity hover:bg-card hover:text-foreground focus-visible:opacity-100 group-hover/item:opacity-100",
                              isActive && "opacity-100",
                            )}
                          >
                            <MoreHorizontalIcon className="size-4" />
                          </motion.button>
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
                  </motion.div>
                )
              })}
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ...springs.gentle }}
        className="border-t border-border/50 p-3"
      >
        <motion.button
          type="button"
          whileHover={{ x: 2 }}
          transition={springs.gentle}
          className="glass glass-border flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-card"
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            A
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">Alex Morgan</span>
            <span className="truncate text-xs text-muted-foreground">Free plan</span>
          </div>
        </motion.button>
      </motion.div>
    </div>
  )
}

import type { Conversation } from "./chat-types"

const now = Date.now()

export const sampleConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Refactoring a React data table",
    updatedAt: now - 1000 * 60 * 8,
    messages: [
      {
        id: "m1",
        role: "user",
        content:
          "I have a large React data table that re-renders on every keystroke in the search box. How can I make it faster?",
        createdAt: now - 1000 * 60 * 12,
      },
      {
        id: "m2",
        role: "assistant",
        createdAt: now - 1000 * 60 * 11,
        content: `Great question — this is one of the most common React performance pitfalls. There are three things working against you here, and we can fix each one.

## 1. Debounce the search input

Filtering on **every** keystroke forces a full pass over your dataset. Debounce it so you only filter after the user pauses typing:

\`\`\`tsx
import { useState, useMemo, useDeferredValue } from "react"

function DataTable({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("")
  // React keeps the input responsive while the heavy list lags behind
  const deferredQuery = useDeferredValue(query)

  const filtered = useMemo(() => {
    if (!deferredQuery) return rows
    const q = deferredQuery.toLowerCase()
    return rows.filter((r) => r.name.toLowerCase().includes(q))
  }, [rows, deferredQuery])

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <Rows data={filtered} />
    </>
  )
}
\`\`\`

## 2. Memoize the row component

Wrap each row in \`React.memo\` so unchanged rows skip re-rendering:

\`\`\`tsx
const TableRow = React.memo(function TableRow({ row }: { row: Row }) {
  return <tr>{/* ... */}</tr>
})
\`\`\`

## 3. Virtualize long lists

If you're rendering more than ~100 rows, only mount what's visible. Libraries like \`@tanstack/react-virtual\` handle this well.

| Technique | Best for |
| --- | --- |
| \`useDeferredValue\` | Keeping inputs snappy |
| \`React.memo\` | Avoiding wasted renders |
| Virtualization | Thousands of rows |

Start with the deferred value — it's a one-line change and usually the biggest win.`,
      },
    ],
  },
  {
    id: "conv-2",
    title: "Weekend trip itinerary for Kyoto",
    updatedAt: now - 1000 * 60 * 60 * 5,
    messages: [
      {
        id: "m3",
        role: "user",
        content: "Plan a relaxed 2-day itinerary for Kyoto in autumn.",
        createdAt: now - 1000 * 60 * 60 * 5,
      },
    ],
  },
  {
    id: "conv-3",
    title: "Explaining database indexes simply",
    updatedAt: now - 1000 * 60 * 60 * 26,
    messages: [
      {
        id: "m4",
        role: "user",
        content: "Explain database indexes like I'm five.",
        createdAt: now - 1000 * 60 * 60 * 26,
      },
    ],
  },
  {
    id: "conv-4",
    title: "Drafting a product launch email",
    updatedAt: now - 1000 * 60 * 60 * 50,
    messages: [
      {
        id: "m5",
        role: "user",
        content: "Help me write a launch announcement email for our new analytics dashboard.",
        createdAt: now - 1000 * 60 * 60 * 50,
      },
    ],
  },
  {
    id: "conv-5",
    title: "TypeScript generics deep dive",
    updatedAt: now - 1000 * 60 * 60 * 24 * 9,
    messages: [
      {
        id: "m6",
        role: "user",
        content: "Walk me through conditional types in TypeScript with examples.",
        createdAt: now - 1000 * 60 * 60 * 24 * 9,
      },
    ],
  },
]

export const suggestionPrompts = [
  {
    title: "Explain a concept",
    subtitle: "Break down how transformers work, simply",
    prompt: "Explain how transformer models work, in simple terms with an analogy.",
  },
  {
    title: "Write some code",
    subtitle: "A debounced search hook in React",
    prompt: "Write a reusable useDebouncedValue hook in React with TypeScript.",
  },
  {
    title: "Draft a message",
    subtitle: "A friendly out-of-office reply",
    prompt: "Draft a warm but professional out-of-office auto-reply for a one week vacation.",
  },
  {
    title: "Plan something",
    subtitle: "A focused 3-hour deep work block",
    prompt: "Help me plan a focused 3-hour deep work session with breaks.",
  },
]

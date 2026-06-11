import type { Message } from "./chat-types"

const codeReply = `Here's a clean, reusable approach you can drop straight into your project.

## The hook

\`\`\`tsx
import { useState, useEffect } from "react"

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
\`\`\`

## How to use it

\`\`\`tsx
function Search() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query, 400)

  // Only fires 400ms after the user stops typing
  useEffect(() => {
    if (debouncedQuery) runSearch(debouncedQuery)
  }, [debouncedQuery])

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />
}
\`\`\`

A few notes:

- The cleanup function cancels the previous timer, so only the **last** value within the delay window is applied.
- Generic typing (\`<T>\`) means it works for strings, numbers, objects — anything.
- For search specifically, pair it with \`useDeferredValue\` if rendering is the bottleneck rather than the network call.

Want me to add a cancel-in-flight version that also aborts the pending request?`

const conceptReply = `Think of a transformer like a room full of people reading the same sentence together.

## The core idea: attention

Every word gets to "look at" every other word and decide *how much each one matters* to it. That weighting is called **attention**.

> The word "it" in "the cat sat because it was tired" learns to pay attention to "cat" — that's attention in action.

## How it flows

1. **Tokenize** — split text into pieces and turn each into a vector of numbers.
2. **Add position** — since the model sees all words at once, we tag each with its position.
3. **Self-attention** — every token mixes in information from the others, weighted by relevance.
4. **Feed-forward** — each token is refined independently.
5. **Stack & repeat** — do this dozens of times; later layers capture more abstract meaning.

## Why it beat older models

| Model | Reads text | Parallel? |
| --- | --- | --- |
| RNN | One word at a time | No |
| Transformer | All words at once | Yes |

That parallelism is what made it possible to train on enormous datasets — and it's the "T" in GPT.

Want me to go deeper on multi-head attention specifically?`

const draftReply = `Here's a warm, professional draft you can tweak:

---

**Subject:** Out of office — back on Monday

Hi there,

Thanks for your message! I'm currently out of office and away from email until **Monday, the 15th**. I'll be fully offline recharging, so I won't be checking messages in the meantime.

For anything urgent, please reach out to **[colleague's name]** at **[email]**, who'll be happy to help.

Otherwise, I'll get back to you as soon as I'm back at my desk. Appreciate your patience!

Warm regards,
**[Your name]**

---

Want a shorter version, or one with a friendlier/more casual tone?`

const planReply = `Love it — focused deep work is a skill worth protecting. Here's a structured 3-hour block:

## The plan

1. **Warm-up (0:00–0:10)** — Write down the *one* outcome you want by the end. Silence notifications, water within reach.
2. **Deep block 1 (0:10–0:60)** — Hardest task first, single tab if possible.
3. **Break (0:60–0:70)** — Stand, stretch, look at something far away. No phone.
4. **Deep block 2 (0:70–2:00)** — Continue or switch to the next priority.
5. **Break (2:00–2:15)** — Short walk, snack.
6. **Deep block 3 (2:15–2:55)** — Final push.
7. **Shutdown (2:55–3:00)** — Note where you left off so tomorrow starts easy.

## Tips that actually help

- Use a visible timer — urgency beats willpower.
- If a distracting thought appears, jot it on a "later" list and keep going.
- Protect the **first 25 minutes** especially; momentum compounds after that.

Want me to turn this into a checklist you can copy?`

const genericReply = `Happy to help with that. Here's how I'd think about it:

- First, let's clarify the goal so the answer is actually useful to you.
- Then I can break it into clear, concrete steps.
- And I'll flag any trade-offs worth knowing about.

Could you share a bit more detail about what you're aiming for? For example, the context it's for and any constraints. In the meantime, here's a quick illustration of formatting I can produce:

\`\`\`ts
type Result<T> = { ok: true; value: T } | { ok: false; error: string }
\`\`\`

The more specifics you give me, the more tailored I can make the response.`

export function generateReply(prompt: string): string {
  const p = prompt.toLowerCase()
  if (/(code|hook|function|react|typescript|javascript|bug|refactor)/.test(p)) {
    return codeReply
  }
  if (/(explain|how does|what is|concept|work|transformer|index)/.test(p)) {
    return conceptReply
  }
  if (/(email|draft|write|message|reply|letter)/.test(p)) {
    return draftReply
  }
  if (/(plan|itinerary|schedule|organize|deep work|session)/.test(p)) {
    return planReply
  }
  return genericReply
}

export function makeMessage(
  role: Message["role"],
  content: string,
  attachments?: Message["attachments"],
): Message {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    attachments,
    createdAt: Date.now(),
  }
}

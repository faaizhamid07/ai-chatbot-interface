export type Role = "user" | "assistant"

export interface Attachment {
  id: string
  name: string
  size: number
  type: string
}

export interface Message {
  id: string
  role: Role
  content: string
  attachments?: Attachment[]
  createdAt: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  updatedAt: number
}

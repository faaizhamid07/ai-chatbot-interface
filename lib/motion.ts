import type { Variants, Transition } from "framer-motion"

// Spring configurations inspired by Apple/Linear
export const springs = {
  gentle: { type: "spring", stiffness: 200, damping: 25 } as Transition,
  snappy: { type: "spring", stiffness: 400, damping: 30 } as Transition,
  bouncy: { type: "spring", stiffness: 500, damping: 25 } as Transition,
  smooth: { type: "spring", stiffness: 150, damping: 20 } as Transition,
}

// Fade + slide variants
export const fadeSlideIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15 },
  },
}

// Fade + scale for modals and overlays
export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.12 },
  },
}

// Sidebar slide animation
export const sidebarSlide: Variants = {
  hidden: (isOpen: boolean) => ({
    width: isOpen ? 288 : 0,
    opacity: isOpen ? 1 : 0,
    transition: springs.smooth,
  }),
  visible: {
    width: 288,
    opacity: 1,
    transition: springs.smooth,
  },
}

// Stagger container for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

// Child item for stagger
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springs.gentle,
  },
}

// Message bubble animation
export const messageBubble: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springs.smooth,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
}

// Typing indicator dots
export const typingDot: Variants = {
  animate: (i: number) => ({
    y: [0, -6, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "loop",
      delay: i * 0.12,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
}

// Button hover tap
export const buttonHover = {
  whileHover: { scale: 1.02, transition: springs.snappy },
  whileTap: { scale: 0.97, transition: springs.bouncy },
}

// Card hover lift
export const cardHover = {
  whileHover: {
    y: -3,
    transition: springs.gentle,
  },
}

// Skeleton shimmer
export const shimmer: Variants = {
  animate: {
    opacity: [0.4, 0.7, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

// Welcome logo entrance
export const logoEntrance: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...springs.bouncy,
      delay: 0.1,
    },
  },
}

// Welcome text entrance
export const textEntrance: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      ...springs.gentle,
      delay: 0.2 + i * 0.1,
    },
  }),
}

// Attachment card
export const attachmentEnter: Variants = {
  hidden: { opacity: 0, scale: 0.9, x: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: springs.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.1 },
  },
}

import { create } from 'zustand'

interface CartStore {
  count: number
  drawerOpen: boolean
  setCount: (count: number) => void
  increment: () => void
  decrement: () => void
  setDrawerOpen: (open: boolean) => void
  toggleDrawer: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  count: 0,
  drawerOpen: false,
  setCount: (count) => set({ count }),
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
}))
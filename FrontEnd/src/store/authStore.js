import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: (userData) =>
        set({
          isAuthenticated: true,
          user: userData,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
        }),
    }),
    {
      name: 'spark-dti-auth',
    }
  )
)

export const useUploadStore = create((set) => ({
  transcriptFile: null,
  transcriptDocumentId: null,
  selectedRole: null,

  setTranscriptFile: (file) => set({ transcriptFile: file }),
  setTranscriptDocumentId: (id) => set({ transcriptDocumentId: id }),
  setSelectedRole: (role) => set({ selectedRole: role }),

  resetTranscript: () =>
    set({ transcriptFile: null, transcriptDocumentId: null }),
}))

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  activeModal: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),
}))
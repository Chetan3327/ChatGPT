import { Chat } from '@prisma/client'
import {create} from 'zustand'

export type ModalType = "deleteChat"

interface ModalData {
    chat?: Chat
    apiUrl?: string
    query?: Record<string, any>
}

interface ModalStore {
    type: ModalType | null
    isOpen: boolean
    data: ModalData
    onOpen: (type: ModalType, data?: ModalData) => void
    onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({isOpen: true, type, data}),
    onClose: () => set({isOpen: false, type: null})
}))
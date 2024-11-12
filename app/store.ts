import { create } from "zustand"
import { shallow } from "zustand/shallow"
import { Note, Folder, FolderStructure, CollectionOfNotes } from "./utils/fileFormat"

type store = {
    // showSidebar: boolean,
    localCollectionOfNotesState: CollectionOfNotes | {},
    localFolderStructureState: FolderStructure | {},


    // toggleSidebarVariable: () => void,
    setlocalCollectionOfNotesState: (newlocalCollectionOfNotesState: CollectionOfNotes | {}) => void,
    setLocalFolderStructureState: (newlocalFolderStructureState: FolderStructure | {}) => void
}

export const appStore = create<store>((set) => ({
    // showSidebar: true,
    localFolderStructureState: {},
    localCollectionOfNotesState:{},
    
    // toggleSidebarVariable: () => set((state) => ({
    //     showSidebar: !state.showSidebar
    // })),
    setlocalCollectionOfNotesState: (newlocalCollectionOfNotesState: CollectionOfNotes | {}) => set({ localCollectionOfNotesState: newlocalCollectionOfNotesState }),
    setLocalFolderStructureState: (newlocalFolderStructureState: FolderStructure | {}) => set({ localFolderStructureState: newlocalFolderStructureState })

}))
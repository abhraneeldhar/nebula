import { create } from "zustand"
import { shallow } from "zustand/shallow"
import { Note, Folder, FolderStructure, CollectionOfNotes } from "./utils/fileFormat"

type store = {
    // showSidebar: boolean,
    localCollectionOfNotesState: CollectionOfNotes | {},
    localFolderStructureState: FolderStructure | {},
    currentOpenNoteIdState: string | null;

    // toggleSidebarVariable: () => void,
    setCurrentOpenNoteIdState:(newNotesIdState: string|null)=>void
    setlocalCollectionOfNotesState: (newlocalCollectionOfNotesState: CollectionOfNotes | {}) => void,
    setLocalFolderStructureState: (newlocalFolderStructureState: FolderStructure | {}) => void
}

export const appStore = create<store>((set) => ({
    // showSidebar: true,
    localFolderStructureState: {},
    localCollectionOfNotesState:{},
    currentOpenNoteIdState:null,
    
    // toggleSidebarVariable: () => set((state) => ({
    //     showSidebar: !state.showSidebar
    // })),
    setCurrentOpenNoteIdState:(newNotesIdState: string|null)=>set({currentOpenNoteIdState:newNotesIdState}),
    setlocalCollectionOfNotesState: (newlocalCollectionOfNotesState: CollectionOfNotes | {}) => set({ localCollectionOfNotesState: newlocalCollectionOfNotesState }),
    setLocalFolderStructureState: (newlocalFolderStructureState: FolderStructure | {}) => set({ localFolderStructureState: newlocalFolderStructureState })

}))
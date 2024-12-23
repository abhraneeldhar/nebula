import { create } from "zustand"
import { shallow } from "zustand/shallow"
import { Note, Folder, FolderStructure } from "./utils/fileFormat"

type store = {
    // showSidebar: boolean,
    userId: string | null,
    localCollectionOfNotesState: CollectionOfNotes | null | {},
    // localFolderStructureState: FolderStructure | {},
    currentOpenNoteIdState: string | null;

    // toggleSidebarVariable: () => void,
    setUserId:(newUserId:string)=>void,
    setCurrentOpenNoteIdState:(newNotesIdState: string|null)=>void
    setlocalCollectionOfNotesState: (newlocalCollectionOfNotesState: CollectionOfNotes | {}) => void,
    // setLocalFolderStructureState: (newlocalFolderStructureState: FolderStructure | {}) => void
}

export const appStore = create<store>((set) => ({
    // showSidebar: true,
    userId: null,
    // localFolderStructureState: {},
    localCollectionOfNotesState:null,
    currentOpenNoteIdState:null,
    
    // toggleSidebarVariable: () => set((state) => ({
    //     showSidebar: !state.showSidebar
    // })),
    setUserId:(newUserId:string)=>set({userId: newUserId}),
    setCurrentOpenNoteIdState:(newNotesIdState: string|null)=>set({currentOpenNoteIdState:newNotesIdState}),
    setlocalCollectionOfNotesState: (newlocalCollectionOfNotesState: CollectionOfNotes | {}) => set({ localCollectionOfNotesState: newlocalCollectionOfNotesState }),
    // setLocalFolderStructureState: (newlocalFolderStructureState: FolderStructure | {}) => set({ localFolderStructureState: newlocalFolderStructureState })

}))
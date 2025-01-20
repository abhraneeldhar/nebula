import { create } from "zustand"
import { shallow } from "zustand/shallow"
import { Note, Folder, FolderStructure } from "./utils/fileFormat"

type store = {
    localCollectionOfNotesState: Note[] | null | {},
    currentOpenNoteIdState: string | null,

    setCurrentOpenNoteIdState:(newNotesIdState: string|null)=>void,
    setlocalCollectionOfNotesState: (newlocalCollectionOfNotesState: Note[] | {}) => void,
}

export const appStore = create<store>((set) => ({
    localCollectionOfNotesState:null,
    currentOpenNoteIdState:null,
    
    setCurrentOpenNoteIdState:(newNotesIdState: string|null)=>set({currentOpenNoteIdState:newNotesIdState}),
    setlocalCollectionOfNotesState: (newlocalCollectionOfNotesState: Note[] | {}) => set({ localCollectionOfNotesState: newlocalCollectionOfNotesState }),

}))
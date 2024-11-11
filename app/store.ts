import { create } from "zustand"
import { shallow } from "zustand/shallow"
import { Note,Folder,FolderStructure } from "./utils/fileFormat"

type store={
    showSidebar: boolean,
    notesFolderState:FolderStructure|{},
    toggleSidebarVariable: ()=> void,
    setNotesFolderState:(newNotesFolderState:FolderStructure|{})=>void
}

export const appStore=create<store>((set)=>({
    showSidebar:true,
    notesFolderState: {},
    setNotesFolderState:(newNotesFolderState:FolderStructure|{})=>{
        set((state)=>({
            notesFolderState:newNotesFolderState
        }))
    },
    toggleSidebarVariable: ()=> set((state)=>({showSidebar: !state.showSidebar
})),
}))
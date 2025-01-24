import { create } from "zustand"
import { Note, userType } from "./utils/fileFormat"

type store = {
    userDetails:userType|null,
    localCollectionOfNotesState: Note[] | null | {},
    currentOpenNoteIdState: string | null,
    currentFriendList:userType[]|null,
    showLoadingPage:boolean,

    setUserDetails:(newUserDetails:userType)=>void;
    setCurrentOpenNoteIdState:(newNotesIdState: string|null)=>void,
    setlocalCollectionOfNotesState: (newlocalCollectionOfNotesState: Note[] | {}) => void,
    setCurrentFriendList:(newFriendsList:userType[]|null)=>void,
    setShowLoadingPage:(newState:boolean)=>void,
}

export const appStore = create<store>((set) => ({
    userDetails:null,
    localCollectionOfNotesState:null,
    currentOpenNoteIdState:null,
    currentFriendList:null,
    showLoadingPage:true,
    
    setUserDetails:(newUserDetails:userType)=>set({userDetails:newUserDetails}),
    setCurrentOpenNoteIdState:(newNotesIdState: string|null)=>set({currentOpenNoteIdState:newNotesIdState}),
    setlocalCollectionOfNotesState: (newlocalCollectionOfNotesState: Note[] | {}) => set({ localCollectionOfNotesState: newlocalCollectionOfNotesState }),
    setCurrentFriendList:(newFriendsList:userType[]|null)=>set({currentFriendList:newFriendsList}),
    setShowLoadingPage:(newState:boolean)=>set({showLoadingPage:newState})
}))
import { create } from "zustand"
import { shallow } from "zustand/shallow"

type store={
    showSidebar: boolean,
    toggleSidebar: ()=> void
}

export const appStore=create<store>((set)=>({
    showSidebar:true,
    toggleSidebar: ()=> set((state)=>({showSidebar: !state.showSidebar
})),
}))
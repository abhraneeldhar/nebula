import { create } from "zustand"
import { shallow } from "zustand/shallow"

type store={
    showSidebar: boolean,
    toggleSidebarVariable: ()=> void
}

export const appStore=create<store>((set)=>({
    showSidebar:true,
    toggleSidebarVariable: ()=> set((state)=>({showSidebar: !state.showSidebar
})),
}))
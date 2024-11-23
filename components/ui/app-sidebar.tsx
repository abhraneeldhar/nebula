"use client"
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarFooter

} from "@/components/ui/sidebar"

import { Collapsible, CollapsibleTrigger, CollapsibleContent, } from "@radix-ui/react-collapsible"
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuGroup } from "@radix-ui/react-dropdown-menu"
import { ChevronUp } from "lucide-react"
import { User2 } from "lucide-react"
// Menu items.
import Image from "next/image"
import searchLogo from "../../public/searchLogo.png"

import styles from "./sidebar.module.css"
import { appStore } from "@/app/store"
import { DisplayNote } from "@/app/utils/fileFormat"
import { CollectedMetadata } from "next/dist/build/webpack/loaders/metadata/types"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from 'next/navigation'
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
]

const FooterMenu = () => {
  return (<>

    <div className={styles.footerMenu}>
      <div className={styles.footerMenuItem}>Item 1</div>
      <div className={styles.footerMenuItem}>Item 1</div>
      <div className={styles.footerMenuItem}>Item 1</div>
      <div className={`${styles.footerMenuItem} ${styles.signOut}`}>Sign Out</div>
    </div>

  </>)
}



export function AppSidebar() {
  // you dont fetch anything bitch

  const router = useRouter()
  const localCollectionOfNotesState = appStore((state) => state.localCollectionOfNotesState) as DisplayNote[]
  const [showFooterMenu, setShowFooterMenu] = useState(false);


  // const setCurrentNoteState=appStore((state)=>state.setCurrentOpenNoteIdState)


  //   useEffect(()=>{
  //     console.log(localCollectionOfNotesState)
  // },[localCollectionOfNotesState])


  // on app boot
  // useEffect(() => {
  //   // addToLocal();
  //   setlocalCollectionOfNotesState(JSON.parse(localStorage.getItem("localCollectionOfNotes") ?? "{}"));
  // }, [])


  return (
    <Sidebar className={styles.sidebar}>

      <SidebarContent>
        <div className={styles.appLogo}>NEBULA</div>

        {/* <div className={styles.search}><input type="text" />
          <div className={styles.searchLogo}>
            <Image src={searchLogo} alt="Q" />
          </div>
        </div> */}

        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div onClick={() => { router.push("/home") }}>
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>



        <SidebarGroup>

          <SidebarGroupLabel>Notes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>

              {/* <ScrollArea className="h-22 w-48 rounded-md border"> */}
              {localCollectionOfNotesState?.sort((a, b) => b.lastModifiedAt - a.lastModifiedAt)?.map((note: DisplayNote) => (
                <SidebarMenuItem key={note.id}>
                  <SidebarMenuButton className={styles.noteBtn} onClick={() => {
                    console.log("lunn");
                    router.push(`/editor/${note.id}`);
                    // setCurrentNoteState(note.id)
                  }}>{note.title}</SidebarMenuButton>
                </SidebarMenuItem>
              ))}




            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {showFooterMenu &&
        <div className={styles.footerBackdrop} onClick={() => { setShowFooterMenu(false) }}></div>
      }
      <SidebarGroup>
        <SidebarGroupContent>

          <SidebarFooter className={styles.sidebarFooter}>
            <DropdownMenu>
              {showFooterMenu && (<FooterMenu />)}

              <DropdownMenuTrigger asChild onClick={(e) => {
                e.stopPropagation;
                setShowFooterMenu(!showFooterMenu);
              }}>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarFooter>

        </SidebarGroupContent>
      </SidebarGroup>
    </Sidebar>
  )
}

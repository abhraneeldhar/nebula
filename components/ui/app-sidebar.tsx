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
  SidebarMenuSubItem
} from "@/components/ui/sidebar"

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible"
// Menu items.
import Image from "next/image"
import searchLogo from "../../public/searchLogo.png"

import styles from "./sidebar.module.css"
import { appStore } from "@/app/store"
import { CollectionOfNotes, FolderStructure } from "@/app/utils/fileFormat"
import { CollectedMetadata } from "next/dist/build/webpack/loaders/metadata/types"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from 'next/navigation'
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]




export function AppSidebar() {
  // you dont fetch anything bitch
  const localCollectionOfNotes = appStore((state) => state.localCollectionOfNotesState) as CollectionOfNotes


  const setCurrentNoteState=appStore((state)=>state.setCurrentOpenNoteIdState)

  const router = useRouter()

  // on app boot
  // useEffect(() => {
  //   // addToLocal();
  //   setlocalCollectionOfNotesState(JSON.parse(localStorage.getItem("localCollectionOfNotes") ?? "{}"));
  // }, [])


  return (
    <Sidebar className={styles.sidebar}>
      
      <SidebarContent>
        <div className={styles.appLogo}>NEBULA</div>
        <div className={styles.search}><input type="text" />
          <div className={styles.searchLogo}>
            <Image src={searchLogo} alt="Q" />
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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

              <ScrollArea className="h-22 w-48 rounded-md border">
                {localCollectionOfNotes.notes?.map((note) => (
                  <SidebarMenuItem key={note.id}>
                    <SidebarMenuButton onClick={() => {
                      console.log("lunn");
                      router.push(`/editor/${note.id}`);
                      setCurrentNoteState(note.id)
                    }}>{note.title}</SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </ScrollArea>

              {/* {localFolderStructureState.folders?.map((folder) => (
                <Collapsible key={folder.id} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger className={styles.trigger}>
                      {">> " + folder.title}
                    </CollapsibleTrigger>

                    {folder.notesInsideIds.map((noteInsideId) => (
                      <CollapsibleContent key={noteInsideId}>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuButton className={styles.subNote}>
                              {localCollectionOfNotes.notes.find(note=>note.id===noteInsideId)?.title}
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    ))}

                  </SidebarMenuItem>
                </Collapsible>
              ))} */}



            </SidebarMenu>
    
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  )
}

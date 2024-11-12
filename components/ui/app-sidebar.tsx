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


const addToLocal = () => {
  const folderStructure: FolderStructure = {
      owner: "big d",
      lastModified: Date.now(),
      rootNoteIds: [123, 124, 125, 126],
      folders: [{
          owner: "big d",
          id: 1234124,
          title: "Folder 1",
          type: "Folder",
          createdAt: Date.now(),
          lastModifiedAt: Date.now(),
          notesInsideIds: [567, 568, 569, 570]
      }]
  }
  localStorage.setItem("localNotesFolderStructure", JSON.stringify(folderStructure));
  const collectionOfNotes: CollectionOfNotes = {
      notes: [
          {
              "owner": "big d",
              "type": "Note",
              "id": 123,
              "title": "Note 1",
              "content": "hello 1",
              "createdAt": 1731356318114,
              "lastModifiedAt": 1731356318114
          },
          {
              "owner": "big d",
              "type": "Note",
              "id": 124,
              "title": "Note 2",
              "content": "hello 2",
              "createdAt": 1731356318114,
              "lastModifiedAt": 1731356318114
          },
          {
              "owner": "big d",
              "type": "Note",
              "id": 125,
              "title": "Note 3",
              "content": "hello 3",
              "createdAt": 1731356318114,
              "lastModifiedAt": 1731356318114
          },
          {
              "owner": "big d",
              "type": "Note",
              "id": 567,
              "title": "Note 4",
              "content": "hello 4",
              "createdAt": 1731356318114,
              "lastModifiedAt": 1731356318114
          },
          {
              "owner": "big d",
              "type": "Note",
              "id": 568,
              "title": "Note 5",
              "content": "hello 5",
              "createdAt": 1731356318114,
              "lastModifiedAt": 1731356318114
          },
          {
              "owner": "big d",
              "type": "Note",
              "id": 569,
              "title": "Note 6",
              "content": "hello 6",
              "createdAt": 1731356318114,
              "lastModifiedAt": 1731356318114
          },
          {
              "owner": "big d",
              "type": "Note",
              "id": 570,
              "title": "Note 7",
              "content": "hello 7",
              "createdAt": 1731356318114,
              "lastModifiedAt": 1731356318114
          }
      ]
  };
  localStorage.setItem("localCollectionOfNotes", JSON.stringify(collectionOfNotes));
}


export function AppSidebar() {
  const localCollectionOfNotes = appStore((state) => state.localCollectionOfNotesState) as CollectionOfNotes
  const localFolderStructureState = appStore((state) => state.localFolderStructureState) as FolderStructure
  const localCollectionOfNotesState = appStore((state) => state.localCollectionOfNotesState) as CollectionOfNotes
  const localNotesFolderStructureState = appStore((state) => state.localFolderStructureState) as FolderStructure
  const setLocalFolderStructureState = appStore((state) => state.setLocalFolderStructureState)
  const setlocalCollectionOfNotesState = appStore((state) => state.setlocalCollectionOfNotesState)

  const router=useRouter()
  // on app boot
  useEffect(() => {
    addToLocal();
    // setLocalFolderStructureState(JSON.parse(localStorage.getItem("localNotesFolderStructure") || ""));
    setlocalCollectionOfNotesState(JSON.parse(localStorage.getItem("localCollectionOfNotes") ?? "{}"));
    // let comparingFolderStructure=localNotesFolderStructure;
    // sanitizeFolderStructure();
    // const currentPath=usePathname()

  }, [])
  useEffect(() => {
    // console.log(localNotesFolderStructureState)
    console.log(localCollectionOfNotesState)
  }, [localCollectionOfNotesState, localNotesFolderStructureState])

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

              {/* <SidebarMenuItem>
                <SidebarMenuButton>Note 1</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Note 2</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Note 3</SidebarMenuButton>
              </SidebarMenuItem> */}



              <ScrollArea className="h-22 w-48 rounded-md border">
                {localCollectionOfNotes.notes?.map((note) => (
                  <SidebarMenuItem key={note.id}>
                    <SidebarMenuButton onClick={() => {
                      console.log("lunn")
                      router.push("/editor")
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

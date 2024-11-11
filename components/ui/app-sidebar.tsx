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

  const notesFolderState = appStore((state) => state.notesFolderState);
  console.log(notesFolderState)
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
              <SidebarMenuItem>
                <SidebarMenuButton>Note 1</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Note 2</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Note 3</SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger className={styles.trigger}>

                    trigger 1 i guesss
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton className={styles.subNote}>
                          item 1
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>

                  <CollapsibleContent >
                    <SidebarMenuSub >
                      <SidebarMenuSubItem>
                        <SidebarMenuButton className={styles.subNote}>
                          item 2
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>

                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  )
}

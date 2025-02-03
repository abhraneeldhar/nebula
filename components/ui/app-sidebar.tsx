"use client"
import { Home, NotebookPen, NotebookText, Settings, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"


import { DropdownMenuTrigger, DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { ChevronUp } from "lucide-react"


import styles from "./sidebar.module.css"
import { appStore } from "@/app/store"
import { DisplayNote } from "@/app/utils/fileFormat"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { signOut } from "next-auth/react"
import LoadingPage from "@/app/_components/loadingPage/page"


const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Friends",
    url: "/friends",
    icon: Users,
  },
  {
    title: "All Documents",
    url: "/allnotes",
    icon: NotebookPen,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]


export function AppSidebar() {

  const router = useRouter()
  const { toggleSidebar, isMobile } = useSidebar();
  const showLoadingPage = appStore((state) => state.showLoadingPage)


  const localCollectionOfNotesState = appStore((state) => state.localCollectionOfNotesState) as DisplayNote[]
  const [showFooterMenu, setShowFooterMenu] = useState(false);

  const userDetails = appStore((state) => state.userDetails)

  const FooterMenu = () => {
    return (<>

      <div className={styles.footerMenu}>
        {/* <div className={styles.footerMenuItem}>Edging</div> */}
        {/* <div className={styles.footerMenuItem}>Gooning</div> */}
        <div className={styles.footerMenuItem} onClick={() => router.push("/settings")}>Settings</div>
        <div className={`${styles.footerMenuItem} ${styles.signOut}`} onClick={() => { signOut() }}>Sign Out</div>
      </div>

    </>)
  }


  return (
    <>
      {showLoadingPage && (
        <LoadingPage />

      )}
      {
        !showLoadingPage && (

      
      <Sidebar className={styles.sidebar}>

        <SidebarContent>
          <div className={styles.appLogo}>NEBULA</div>

          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <div onClick={() => {
                        router.push(item.url);
                        if (isMobile) {
                          toggleSidebar()
                        }
                      }}>
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

            <SidebarGroupLabel>Docs</SidebarGroupLabel>
            <SidebarGroupContent>

              <SidebarMenu>
                <SidebarMenuItem className={styles.newNoteMenuItem}>
                  <SidebarMenuButton onClick={() => {
                    router.push("/editor");
                    if (isMobile) {
                      toggleSidebar()
                    }
                  }}>
                    New Document
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* <ScrollArea className="h-22 w-48 rounded-md border"> */}
                {localCollectionOfNotesState && localCollectionOfNotesState?.sort((a, b) => b.lastModifiedAt - a.lastModifiedAt)?.map((note: DisplayNote) => (
                  <SidebarMenuItem key={note.id}>
                    <SidebarMenuButton className={styles.noteBtn} onClick={() => {
                      if (isMobile) {
                        toggleSidebar()
                      }
                      router.push(`/editor/${note.id}`);
                      // setCurrentNoteState(note.id)
                    }}><NotebookText />{note.title}</SidebarMenuButton>
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
                  <SidebarMenuButton className={styles.usernameBox}>
                    <Avatar className={styles.avatarImg}>
                      {userDetails &&
                        <AvatarImage src={userDetails?.imageUrl} alt="" />
                      }
                      <AvatarFallback>{userDetails && userDetails?.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    {userDetails?.name}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
              </DropdownMenu>
            </SidebarFooter>

          </SidebarGroupContent>
        </SidebarGroup>
      </Sidebar>
      )}
    </>)
}

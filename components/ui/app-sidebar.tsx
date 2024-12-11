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
  SidebarFooter

} from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

// import { Collapsible, CollapsibleTrigger, CollapsibleContent, } from "@radix-ui/react-collapsible"
import { DropdownMenuTrigger, DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { ChevronUp } from "lucide-react"
import { User2 } from "lucide-react"
// Menu items.
// import Image from "next/image"
// import searchLogo from "../../public/searchLogo.png"

import styles from "./sidebar.module.css"
import { appStore } from "@/app/store"
import { DisplayNote } from "@/app/utils/fileFormat"
// import { CollectedMetadata } from "next/dist/build/webpack/loaders/metadata/types"
// import { ScrollArea } from "@radix-ui/react-scroll-area"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { fetchUserId } from "@/app/utils/fetchUserId"
import { userDetailsType } from "@/app/setupAccount/page"
import { getUserDetails } from "@/app/utils/getUserDetails"
import { signOut } from "next-auth/react"
import { SheetContent, SheetTitle } from "./sheet"


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
    title: "All Notes",
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
  const localCollectionOfNotesState = appStore((state) => state.localCollectionOfNotesState) as DisplayNote[]
  const [showFooterMenu, setShowFooterMenu] = useState(false);

  const { data: session } = useSession();
  const [userId, setUserId] = useState<string | null>(null)
  const [userDetails, setUserDetails] = useState<userDetailsType>()

  useEffect(() => {
    if (!userId && session?.user?.email) {
      console.log("session>>>", session)
      const getUserId = async () => {
        console.log("fetching user Id");
        const newUserId = await fetchUserId(String(session?.user?.email))
        console.log("userId>>>>", newUserId);
        if (newUserId != userId) {
          setUserId(newUserId)
        }
      }
      getUserId();
    }
  }, [, userId, session])

  useEffect(() => {
    if (userId) {
      const asyncGetUserDetails = async () => {
        const newUserDetails = await getUserDetails(userId);
        setUserDetails(newUserDetails);
      }
      asyncGetUserDetails();
    }
  }, [userId])

  const FooterMenu = () => {
    return (<>

      <div className={styles.footerMenu}>
        <div className={styles.footerMenuItem}>Edging</div>
        <div className={styles.footerMenuItem}>Gooning</div>
        <div className={styles.footerMenuItem} onClick={() => router.push("/settings")}>Settings</div>
        <div className={`${styles.footerMenuItem} ${styles.signOut}`} onClick={() => { signOut() }}>Sign Out</div>
      </div>

    </>)
  }

  return (
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
                    <div onClick={() => { router.push(item.url) }}>
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
              <SidebarMenuItem className={styles.newNoteMenuItem}>
                <SidebarMenuButton onClick={()=>{router.push("/editor")}}>
                  New Note
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* <ScrollArea className="h-22 w-48 rounded-md border"> */}
              {localCollectionOfNotesState?.sort((a, b) => b.lastModifiedAt - a.lastModifiedAt)?.map((note: DisplayNote) => (
                <SidebarMenuItem key={note.id}>
                  <SidebarMenuButton className={styles.noteBtn} onClick={() => {
                    console.log("lunn");
                    router.push(`/editor/${note.id}`);
                    // setCurrentNoteState(note.id)
                  }}><NotebookText/>{note.title}</SidebarMenuButton>
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
                    <AvatarImage src={userDetails?.imageUrl} alt="User" />
                    <AvatarFallback>{userDetails?.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  {userDetails?.name || "Username"}
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

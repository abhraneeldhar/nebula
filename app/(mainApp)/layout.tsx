import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import SessionWrapper from "../_components/sessionWrapper"
// import { appStore } from "../store"

export default async function Layout({ children }: { children: React.ReactNode }) {
  
  return (
    <SessionWrapper>
      <SidebarProvider>
        <AppSidebar />
        <main className="main">
          {children}
        </main>
      </SidebarProvider>
    </SessionWrapper>
  )
}

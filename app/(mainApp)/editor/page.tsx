"use client"
import styles from "./editor.module.css"
import { appStore } from "@/app/store"
import { useSidebar } from "@/components/ui/sidebar";
import React from "react";
import Image from "next/image";
import closeSVG from "../../../public/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import menuSVG from "../../../public/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"

export default function Editor(){
    // const sidebarShow = appStore((state) => state.showSidebar)
    // const toggleSidebarVariable = appStore((state) => state.toggleSidebarVariable)

    const Tab = ({ tabName }: { tabName: string })=> {
        const { toggleSidebar,open } = useSidebar();
        return (<>
            <div className={styles.tabBar}>
                <div className={styles.sidebarBtn}>
                    <Image src={open ? closeSVG : menuSVG} alt="sidebarBtn" onClick={() => {
                        toggleSidebar()
                    }
                    } />
                </div>
                <p>{tabName}</p>
            </div>
        </>)
    }
    return(<>
    <Tab tabName="Editor"></Tab>
    editor
    </>)
}
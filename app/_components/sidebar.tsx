"use client"
import styles from "./sidebar.module.css";
import { appStore } from "../store";
import { useRef } from "react";



export default function Sidebar(){
    const sidebarObject=document.querySelector(`.${styles.sidebar}`)
    // const sidebarObject=useRef<HTMLDivElement>(null)
    const sidebarShow=appStore((state)=>(state.showSidebar))

    if(sidebarObject && sidebarShow==true){
        sidebarObject?.classList.remove(styles.sidebarHide)
        sidebarObject?.classList.add(styles.sidebarShow)
    }
    else if(sidebarObject && sidebarShow==false){
        sidebarObject?.classList.remove(styles.sidebarShow)
        sidebarObject?.classList.add(styles.sidebarHide)
        
    }
    

    return(
        <><div className={`${styles.sidebar} ${styles.sidebarShow}`}>
            <p>sidebar shit</p>
            <p>sidebar shit</p>
            <p>sidebar shit</p>
            <p>sidebar shit</p>
            <p>sidebar shit</p>
            <p>sidebar shit</p>
        </div>
        </>
    )
}
"use client"
import styles from "./sidebar.module.css";
import { appStore } from "../store";



export default function Sidebar(){
    const sidebarObject=document.querySelector(`.${styles.sidebar}`)
    const sidebarShow=appStore((state)=>(state.showSidebar))

    if(sidebarObject && sidebarShow==true){
        sidebarObject.classList.remove(styles.sidebarHide)
        sidebarObject.classList.add(styles.sidebarShow)
    }
    else if(sidebarObject && sidebarShow==false){
        sidebarObject.classList.remove(styles.sidebarShow)
        sidebarObject.classList.add(styles.sidebarHide)
        
    }
    console.log(sidebarObject?.classList)
    

    return(
        <><div className={`${styles.sidebar} ${styles.sidebarShow}`}>
            sidebar shit
        </div>
        </>
    )
}
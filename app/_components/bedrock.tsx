"use client"
import styles from "./bedrock.module.css";
import { useState } from "react";
import { appStore } from "../store";

export default function Bedrock(){
    const [sidebarShow,setSidebarShow]=useState(true);
    const toggleSidebar=appStore((state)=>state.toggleSidebar)
    
    
    


    return(
        <><div className={styles.main}>
            bedrock
            <button onClick={()=>toggleSidebar()}>Toggle</button>
        </div>
        </>
    )
}
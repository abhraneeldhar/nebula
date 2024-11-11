"use client"
import styles from "./bedrock.module.css";
// import "../global.css"
import { ReactNode, useState } from "react";
import { appStore } from "../store";
import Image from "next/image";

import closeSVG from "../../public/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import menuSVG from "../../public/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"

import coverImage from "./assetImages/coverimage.png"
import profilePic from "./assetImages/profilePic.jpg"

import WeathersTab from "./weathersTab/weatherstab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSidebar } from "@/components/ui/sidebar";

export interface Note {
    id: string,
    fileName: string,
    dateOfCreation: string,
    lastModified: string,
    noteContent: string,
}
export interface notesCollection {
    notes: Note[],
}
const addToLocal = () => {
    const notesData: notesCollection = {
        notes: [
            {
                id: "1",
                fileName: "Meeting Notes",
                dateOfCreation: "2024-11-01",
                lastModified: "2024-11-05",
                noteContent: "Meeting with the design team..."
            },
            {
                id: "2",
                fileName: "Project Plan",
                dateOfCreation: "2024-11-02",
                lastModified: "2024-11-06",
                noteContent: "Outline of project goals and deadlines..."
            }
        ]
    };
    localStorage.setItem("localNotes", JSON.stringify(notesData));
}




export default function Bedrock() {
    const sidebarShow = appStore((state) => state.showSidebar)
    const toggleSidebarVariable = appStore((state) => state.toggleSidebarVariable)


    const Tab = ({ tabName }: { tabName: string }): ReactNode => {
        const {toggleSidebar}=useSidebar();
        return (<>
            <div className={styles.tabBar}>
                <div className={styles.sidebarBtn}>
                    <Image src={sidebarShow ? closeSVG : menuSVG} alt="sidebarBtn" onClick={() => {toggleSidebar()
                        toggleSidebarVariable()}
                    } />
                </div>
                <p>{tabName}</p>
            </div>
        </>)
    }


    return (<>
        {/* <div className={styles.tabBar}>
            <p>Home</p>
        </div> */}
        <div className={styles.main}>
            <Tab tabName="Home"/>
            <div className={styles.displayContent}>
                <div className={styles.coverImage}>
                    <Image src={coverImage} alt="cover image" />
                    <div className={styles.profilePic}>
                        <Image src={profilePic} alt="profilePic" />
                    </div>
                </div>

                {/* <WeathersTab /> */}

                <button onClick={() => addToLocal()}>Click to add to local storage</button>

                <div className={styles.notesNshi}>
                    <Tabs defaultValue="Vault" className="dark">
                        <TabsList>
                            <TabsTrigger value="Vault" className={styles.tabsTrigger}>Vault</TabsTrigger>
                            <TabsTrigger value="Forge">Forge</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Vault">All your Notes are here</TabsContent>
                        <TabsContent value="Forge">All your To-do lists are here</TabsContent>
                    </Tabs>
                </div>

            </div>
        </div>
    </>
    )
}
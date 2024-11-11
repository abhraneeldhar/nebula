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

import { Note, Folder, FolderStructure } from "../utils/fileFormat";
const addToLocal = () => {
    const notesData: FolderStructure = {
        owner: "big d",
        rootNotes: [
            {
                owner: "big d",
                type: "Note",
                id: 1234,
                title: "Note 1",
                content: "hello 1",
                createdAt: Date.now(),
                lastModifiedAt: Date.now()
            },
            {
                owner: "big d",
                type: "Note",
                id: 1234,
                title: "Note 2",
                content: "hello 2",
                createdAt: Date.now(),
                lastModifiedAt: Date.now()
            }
        ],
        folders: [{
            owner: "big d",
            id: 1234,
            title: "Folder 1",
            type: "Folder",
            createdAt: Date.now(),
            lastModifiedAt: Date.now(),
            notesInside: [
                {
                    owner: "big d",
                    type: "Note",
                    id: 1234,
                    title: "Note 3",
                    content: "hello 3",
                    createdAt: Date.now(),
                    lastModifiedAt: Date.now()
                },
                {
                    owner: "big d",
                    type: "Note",
                    id: 1234,
                    title: "Note 4",
                    content: "hello 4",
                    createdAt: Date.now(),
                    lastModifiedAt: Date.now()
                }

            ]
        }]
    }
    localStorage.setItem("localNotesFolderStructure", JSON.stringify(notesData));
}





export default function Bedrock() {
    const sidebarShow = appStore((state) => state.showSidebar)
    const toggleSidebarVariable = appStore((state) => state.toggleSidebarVariable)

    const setNotesState = appStore((state) => state.setNotesFolderState)



    const Tab = ({ tabName }: { tabName: string }): ReactNode => {
        const { toggleSidebar } = useSidebar();
        return (<>
            <div className={styles.tabBar}>
                <div className={styles.sidebarBtn}>
                    <Image src={sidebarShow ? closeSVG : menuSVG} alt="sidebarBtn" onClick={() => {
                        toggleSidebar()
                        toggleSidebarVariable()
                    }
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
            <Tab tabName="Home" />
            <div className={styles.displayContent}>
                <div className={styles.coverImage}>
                    <Image src={coverImage} alt="cover image" />
                    <div className={styles.profilePic}>
                        <Image src={profilePic} alt="profilePic" />
                    </div>
                </div>

                {/* <WeathersTab /> */}

                <button onClick={() => addToLocal()}>Click to add to local storage</button>
                <button onClick={() => setNotesState(JSON.parse(localStorage.getItem("localNotesFolderStructure")||""))}>Add to store</button>

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
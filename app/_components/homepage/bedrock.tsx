"use client"
import styles from "./bedrock.module.css";
import { ReactNode, useEffect, useState } from "react";
import { appStore } from "../../store";
import Image from "next/image";

import closeSVG from "../../../public/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import menuSVG from "../../../public/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"

import coverImage from ".././assetImages/coverimage.png"
import profilePic from ".././assetImages/profilePic.jpg"

import WeathersTab from "../weathersTab/weatherstab";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSidebar } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import { Note, Folder, FolderStructure, CollectionOfNotes } from "../../utils/fileFormat";
// import { useRouter } from "next/navigation";






export default function Bedrock() {
    // const router = useRouter()
    const localCollectionOfNotesState = appStore((state) => state.localCollectionOfNotesState) as CollectionOfNotes
    const setlocalCollectionOfNotesState=appStore((state)=> state.setlocalCollectionOfNotesState)

    
    const Tab = ({ tabName }: { tabName: string }) => {
        const { toggleSidebar, open } = useSidebar();
        return (<>
            <div className={styles.tabBar}>
                <div className={styles.sidebarBtn}>
                    <Image src={open ? closeSVG : menuSVG} alt="sidebarBtn" onClick={() => {
                        toggleSidebar();
                    }
                    } />
                </div>
                <p>{tabName}</p>
            </div>
        </>)
    }

    useEffect(()=>{
        const collectionOfNotes: CollectionOfNotes = {
            notes: [
                {
                    "owner": "big d",
                    "type": "Note",
                    "id": "123",
                    parent: {
                        folderId: 0,
                        folderName: "root"
                    },
                    "title": "Note 1",
                    "content": "hello 1",
                    "createdAt": 1731356318114,
                    "lastModifiedAt": 1731356318114
                },
                {
                    "owner": "big d",
                    "type": "Note",
                    "id": "124",
                    parent: {
                        folderId: 0,
                        folderName: "root"
                    },
                    "title": "Note 2",
                    "content": "hello 2",
                    "createdAt": 1731356318114,
                    "lastModifiedAt": 1731356318114
                },
                {
                    "owner": "big d",
                    "type": "Note",
                    "id": "125",
                    parent: {
                        folderId: 0,
                        folderName: "root"
                    },
                    "title": "Note 3",
                    "content": "hello 3",
                    "createdAt": 1731356318114,
                    "lastModifiedAt": 1731356318114
                },
                {
                    "owner": "big d",
                    "type": "Note",
                    "id": "567",
                    parent: {
                        folderId: 0,
                        folderName: "root"
                    },
                    "title": "Note 4",
                    "content": "hello 4",
                    "createdAt": 1731356318114,
                    "lastModifiedAt": 1731356318114
                },
                {
                    "owner": "big d",
                    "type": "Note",
                    "id": "568",
                    parent: {
                        folderId: 0,
                        folderName: "root"
                    },
                    "title": "Note 5",
                    "content": "hello 5",
                    "createdAt": 1731356318114,
                    "lastModifiedAt": 1731356318114
                }
            ]
        };
        setlocalCollectionOfNotesState(collectionOfNotes);
    },[])

    return (<>
        {/* <Tab tabName="Home" /> */}


        {/* <ScrollArea className={styles.scrollArea}> */}
        <div className={styles.main}>
            <div className={styles.displayContent}>
                <div className={styles.coverImage}>
                    <Image src={coverImage} alt="cover image" />
                    <div className={styles.profilePic}>
                        <Image src={profilePic} alt="profilePic" />
                    </div>
                </div>


                {/* <WeathersTab /> */}


                {/* <button onClick={() => addToLocal()}>Click to add to local storage</button> */}

                <div className={styles.notesNshi}>
                    <Tabs defaultValue="Vault" className="dark">
                        <div className={styles.tabName}>

                            <TabsList>
                                <TabsTrigger value="Vault" className={styles.tabsTrigger}>Vault</TabsTrigger>
                                <TabsTrigger value="Forge">Forge</TabsTrigger>
                            </TabsList>
                        </div>
                        {/* <div className={styles.tabsContent}> */}
                        <TabsContent className={styles.tabsContent} value="Vault">
                            {localCollectionOfNotesState.notes?.map((note) => (
                                <Card className={styles.card} key={note.id}>
                                    <CardHeader>
                                        <CardTitle className={styles.cardTitle}>
                                            {note.title}
                                        </CardTitle>
                                        <CardDescription>
                                            last modified <p>{`${Math.floor((Date.now() - note.lastModifiedAt) / (1000 * 60 * 60))} hours and ${Math.floor(((Date.now() - note.lastModifiedAt) % (1000 * 60 * 60)) / (1000 * 60))} minutes ago`}</p>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className={styles.cardContent}>
                                        <p>{note.content.slice(0, 10)}</p>
                                    </CardContent>
                                </Card>

                            ))}
                        </TabsContent>
                        <TabsContent value="Forge">
                            All your To-do lists are here
                        </TabsContent>
                        {/* </div> */}
                    </Tabs>
                </div>


            </div>
        </div>
        {/* </ScrollArea> */}
    </>
    )
}
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

import { Note, Folder, FolderStructure, DisplayNote } from "../../utils/fileFormat";
// import { useRouter } from "next/navigation";

import rightArrow from "../../../public/arrowright.png";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetchUserId } from "@/app/utils/fetchUserId";
import { getDisplayName } from "next/dist/shared/lib/utils";
import { getDisplayNotes } from "@/app/utils/getDisplayNotes";
import NewNoteBtn from "../newNoteBtn/newNoteBtn";

export default function Bedrock() {
    const router = useRouter()
    const localCollectionOfNotesState = appStore((state) => state.localCollectionOfNotesState) as DisplayNote[]
    const setlocalCollectionOfNotesState = appStore((state) => state.setlocalCollectionOfNotesState)


    const { data: session } = useSession();
    const [userId, setUserId] = useState<string | null>(null)
    useEffect(() => {
        if (!userId && session?.user?.email) {
            const getUserId = async () => {
                const newUserId = await fetchUserId(String(session?.user?.email))
                if (newUserId != userId) {
                    setUserId(newUserId)
                }
            }
            getUserId();
        }
    }, [userId, session])
    // useEffect(() => {
    //     if (userId) {
    //         console.log("userid>>>>", userId)
    //     }
    // }, [userId])
    //     useEffect(()=>{
    //         const topNotes = localCollectionOfNotesState.sort((a, b) => b.lastModifiedAt - a.lastModifiedAt)
    //   .slice(0, 3);
    //         console.log(topNotes)
    //     },[localCollectionOfNotesState])

    useEffect(() => {
        if (localCollectionOfNotesState == null && userId != null) {
            const asyncDisplayNotes = async () => {
                console.log("fetching notes")
                setlocalCollectionOfNotesState(await getDisplayNotes(userId));
            }
            asyncDisplayNotes();
        }
    }, [localCollectionOfNotesState, userId])





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


    return (<>
        <Tab tabName="Home" />
        

        {/* <ScrollArea className={styles.scrollArea}> */}
        <div className={styles.main}>
        <NewNoteBtn/>
            <div className={styles.displayContent}>
                <div className={styles.coverImage}>
                    <Image src={coverImage} alt="cover image" />
                    <div className={styles.profilePic}>
                        <Image src={profilePic} alt="profilePic" />
                    </div>
                </div>

                {/* <WeathersTab /> */}

                <div className={styles.notesAndOthersContainer}>
                    <div className={styles.notesSection} onClick={() => {
                        router.push("/allnotes")
                        console.log("opens notes page");
                    }}>
                        <h2>Open Notes<Image src={rightArrow} alt=">" className={styles.rightArrow} /></h2>
                        <div className={styles.notesContainer}>
                            {localCollectionOfNotesState && localCollectionOfNotesState.length == 0 && (
                                <p> no recent notes</p>
                            )}
                            {(localCollectionOfNotesState)&&(localCollectionOfNotesState.length > 0) && localCollectionOfNotesState?.sort((a, b) => b.lastModifiedAt - a.lastModifiedAt).slice(0, 3)?.map((note) => (

                                <div className={styles.noteCard} key={note.id} onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Note card clicked");
                                    router.push(`/editor/${note.id}`);
                                }}>
                                    <h3>{note.title}</h3>
                                    <div className={styles.noteSnippet}>{note.snippet}
                                    </div>
                                </div>

                            ))}


                        </div>
                    </div>
                </div>


            </div>
        </div >
    </>
    )
}
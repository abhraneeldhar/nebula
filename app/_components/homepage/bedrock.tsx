"use client"
import styles from "./bedrock.module.css";
import { useEffect, useState } from "react";
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

import { Note, Folder, DisplayNote } from "../../utils/fileFormat";


import rightArrow from "../../../public/arrowright.png";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetchUserId } from "@/app/utils/fetchUserId";
import { getDisplayName } from "next/dist/shared/lib/utils";
import { getDisplayNotes } from "@/app/utils/getDisplayNotes";
import NewNoteBtn from "../newNoteBtn/newNoteBtn";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@radix-ui/themes";
import { Flex } from "@radix-ui/themes";
import { Button } from "@radix-ui/themes";
// import { supabase } from "@/app/utils/supabase/client";


import { getUserDetails } from "@/app/utils/getUserDetails";
import { userDetailsType } from "@/app/setupAccount/page";

export default function Bedrock() {
    const router = useRouter();

    const localCollectionOfNotesState = appStore((state) => state.localCollectionOfNotesState) as DisplayNote[]
    const setlocalCollectionOfNotesState = appStore((state) => state.setlocalCollectionOfNotesState)

    const [loadingDisplayNotes, setLoadingDisplayNotes] = useState(true);

    const { data: session } = useSession();
    const [userId, setUserId] = useState<string | null>(null)
    const [userDetails, setUserDetails] = useState<userDetailsType>()
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


    useEffect(() => {
        if (userId) {
            const asyncGetUserDetails = async () => {
                const newUserDetails = await getUserDetails(userId);
                setUserDetails(newUserDetails);
            }
            asyncGetUserDetails();
        }
    }, [userId])

    const [refreshCollectionOfNotes,setRefreshCollectionOfNotes]=useState(false)


    useEffect(() => {
        if (localCollectionOfNotesState == null && userId != null) {
            const asyncDisplayNotes = async () => {
                console.log("fetching notes")
                setLoadingDisplayNotes(true);
                setlocalCollectionOfNotesState(await getDisplayNotes(userId));
                setLoadingDisplayNotes(false);
            }
            asyncDisplayNotes();
        }
    }, [localCollectionOfNotesState, userId])

    useEffect(()=>{
        if (userId != null) {
            const asyncDisplayNotes = async () => {
                console.log("fetching notes")
                setLoadingDisplayNotes(true);
                setlocalCollectionOfNotesState(await getDisplayNotes(userId));
                setLoadingDisplayNotes(false);
            }
            asyncDisplayNotes();
        }

    },[,refreshCollectionOfNotes])



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


        <div className={styles.main}>
            <NewNoteBtn />
            <div className={styles.displayContent}>
                <div className={styles.coverImage}>
                    <Image src={coverImage} alt="cover image" />
                    <div className={styles.profilePic}>
                        <Image src={userDetails?.imageUrl||profilePic} unoptimized={true} priority={true} width={100} height={100} alt="profilePic" />
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
                            {loadingDisplayNotes && !localCollectionOfNotesState && (<>
                                <Skeleton className={styles.loadingNote} onClick={(e) => { e.stopPropagation() }}>
                                </Skeleton>
                                <Skeleton className={styles.loadingNote} onClick={(e) => { e.stopPropagation() }}></Skeleton>
                                <Skeleton className={styles.loadingNote} onClick={(e) => { e.stopPropagation() }}></Skeleton>
                            </>)}

                            {localCollectionOfNotesState && localCollectionOfNotesState.length == 0 && (
                                <p> no recent notes</p>
                            )}
                            {(localCollectionOfNotesState) && (localCollectionOfNotesState.length > 0) && localCollectionOfNotesState?.sort((a, b) => b.lastModifiedAt - a.lastModifiedAt).slice(0, 3)?.map((note) => (

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
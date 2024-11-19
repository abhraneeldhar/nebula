"use client"
import styles from "./allnotes.module.css"
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import closeSVG from "../../../public/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import menuSVG from "../../../public/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import { DropdownMenuDemo } from "../dropDownMenu/dropDownMenu";
import { appStore } from "@/app/store";
import { useEffect,useState } from "react";
import { fetchUserId } from "@/app/utils/fetchUserId";
import { useSession } from "next-auth/react";
import { getDisplayNotes } from "@/app/utils/getDisplayNotes";
import { DisplayNote } from "@/app/utils/fileFormat";
import { useRouter } from "next/navigation";


export default function AllNotesComponent() {
    const router=useRouter();
    const localCollectionOfNotesState=appStore((state)=>state.localCollectionOfNotesState) as DisplayNote[]
    const setlocalCollectionOfNotesState=appStore((state)=>state.setlocalCollectionOfNotesState)

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

    useEffect(() => {
        if (localCollectionOfNotesState == null && userId != null) {
            const asyncDisplayNotes = async () => {
                console.log("fetching notes")
                setlocalCollectionOfNotesState(await getDisplayNotes(userId));
            }
            asyncDisplayNotes();
        }
        console.log(localCollectionOfNotesState)
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

        <Tab tabName="All Notes" />


        <div className={styles.main}>
            <div className={styles.notesContainer}>

                {
                    localCollectionOfNotesState?.map((note: DisplayNote)=>(
                        <div className={styles.noteCard} key={note.id} onClick={(e) => {
                            e.stopPropagation();
                            console.log("Note card clicked");
                            router.push(`/editor/${note.id}`)
                        }}>
                            <h3>{note.title}</h3>
                            <DropdownMenuDemo noteId={note.id}/>
                            <div className={styles.noteSnippet}>Note snippet goes here heheheehehehe</div>
                        </div>
                    ))
                }
                

            </div>
        </div>


    </>)
}
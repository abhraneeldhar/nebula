"use client"
import styles from "./allnotes.module.css"
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import closeSVG from "../../../public/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import menuSVG from "../../../public/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import { appStore } from "@/app/store";
import { useEffect, useRef, useState } from "react";
import { fetchUserId } from "@/app/utils/fetchUserId";
import { useSession } from "next-auth/react";
import { getDisplayNotes } from "@/app/utils/getDisplayNotes";
import { DisplayNote } from "@/app/utils/fileFormat";
import { useRouter } from "next/navigation";
import NewNoteBtn from "../newNoteBtn/newNoteBtn";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@radix-ui/themes";


import { renameNote } from "@/app/utils/renameNote";
import { deleteNote } from "@/app/utils/deleteNote";

export default function AllNotesComponent() {
    const router = useRouter();
    const localCollectionOfNotesState = appStore((state) => state.localCollectionOfNotesState) as DisplayNote[]
    const setlocalCollectionOfNotesState = appStore((state) => state.setlocalCollectionOfNotesState)


    const [openRename, setRenameOpen] = useState(false);
    const [renameNoteId, setRenameNoteId] = useState<string>("");
    const [renameNoteName, setRenameNoteName] = useState<string>("");
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteNoteId, setDeleteNoteId] = useState("");
    const [deleteNoteName, setDeleteNoteName] = useState("");

    // var refreshToggle=useRef<number>(0)
    const [loadingDisplayNotes, setLoadingDisplayNotes] = useState(true);

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
        console.log(localCollectionOfNotesState)
    }, [localCollectionOfNotesState, userId])

    useEffect(() => {
        if (userId != null) {
            const asyncDisplayNotes = async () => {
                console.log("fetching notes")
                setLoadingDisplayNotes(true);
                setlocalCollectionOfNotesState(await getDisplayNotes(userId));
                setLoadingDisplayNotes(false);
            }
            asyncDisplayNotes();
        }
        console.log(localCollectionOfNotesState)
    }, [, refreshCollectionOfNotes])


    // const renameInputRef = useRef<HTMLInputElement>(null);

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

        <Tab tabName="Notes Manager" />

        <Dialog open={openRename} onOpenChange={(e) => {
            setRenameOpen(e);
            // console.log(e);
            setRenameNoteId("");
            setRenameNoteName("");
        }}>



            <DialogContent className={`${styles.renameDialog}`}>
                <form onSubmit={(e) => {
                    // e.preventDefault();
                    setRenameOpen(false);
                    renameNote(renameNoteId, renameNoteName);
                    // refreshToggle.current+=1;
                    // console.log("refresh: ", refreshToggle)
                    console.log("renaming ", renameNoteId, " to ", renameNoteName);
                    setRefreshCollectionOfNotes((prev)=>!prev);
                }}>
                    <DialogHeader>
                        <DialogTitle>Rename note</DialogTitle>
                        <DialogDescription>
                            Make changes to your document.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">

                            <Label htmlFor="name" className="text-right">
                                File Name
                            </Label>
                            <Input className="col-span-3" defaultValue={renameNoteName} onChange={(e) => {
                                setRenameNoteName(e.target.value);
                            }} />

                        </div>
                    </div>
                    <DialogFooter className={styles.dialogFooter}>
                        <Button onClick={() => { setRenameOpen(false) }} className={styles.cancelRename}>Cancel</Button>
                        <Button type="submit" >Rename</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>


        <Dialog open={openDelete} onOpenChange={(e) => {
            setOpenDelete(e);
            // console.log(e);
            setDeleteNoteId("");
            setDeleteNoteName("");
        }}>
            <DialogContent className={`${styles.deleteDialog}`}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    setOpenDelete(false);
                    deleteNote(deleteNoteId)
                    setRefreshCollectionOfNotes((prev)=>!prev)
                }}>
                    <DialogHeader>
                        <DialogTitle>Delete note</DialogTitle>
                        <DialogDescription>
                            Delete <b>{deleteNoteName}</b> permanenetly?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className={styles.dialogFooter}>
                        <Button onClick={() => { setOpenDelete(false) }} className={styles.cancelDelete}>Cancel</Button>
                        <Button type="submit" className={styles.deleteBtn}>Delete</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>


        <div className={styles.main}>
            <NewNoteBtn />
            <div className={styles.notesContainer}>
                {loadingDisplayNotes && !localCollectionOfNotesState && (<>
                    <Skeleton className={styles.loadingNote} onClick={(e) => { e.stopPropagation() }}></Skeleton>
                    <Skeleton className={styles.loadingNote} onClick={(e) => { e.stopPropagation() }}></Skeleton>
                    <Skeleton className={styles.loadingNote} onClick={(e) => { e.stopPropagation() }}></Skeleton>
                </>)}

                {localCollectionOfNotesState?.sort((a, b) => b.lastModifiedAt - a.lastModifiedAt)?.map((note: DisplayNote) => (
                    <div className={styles.noteCard} key={note.id} onClick={(e) => {
                        e.stopPropagation();
                        console.log("Note card clicked");
                        router.push(`/editor/${note.id}`)
                    }}>
                        <h3>{note.title}</h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger className={styles.dropDownMenuTrigger} onClick={(e) => {
                                e.stopPropagation();
                            }}>
                                <div>...</div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className={`w-30 ${styles.dropDownMenu}`} onClick={(e) => {
                                e.stopPropagation();
                            }}>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => {
                                        console.log(" rename");
                                        setRenameOpen(true);
                                        setRenameNoteId(note.id);
                                        setRenameNoteName(note.title);
                                    }}>Rename</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        console.log(" share")
                                    }}>Share</DropdownMenuItem>
                                    {/* <DropdownMenuSeparator /> */}
                                    <DropdownMenuItem className={styles.deleteBtn} onClick={() => {
                                        console.log(" delete")
                                        setDeleteNoteId(note.id);
                                        setDeleteNoteName(note.title);
                                        setOpenDelete(true);
                                        // deleteNote(note.id);
                                    }}>Delete</DropdownMenuItem>

                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {/* <noteCardDropdownMenu/> */}
                        <div className={styles.noteSnippet}>{note.snippet}</div>
                    </div>
                ))
                }
            </div>
        </div>
    </>)
}
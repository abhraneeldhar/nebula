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
import { getUserDetailsFromEmail } from "@/app/utils/getUserDetailsFromEmail";

export default function AllNotesComponent() {
    const router = useRouter();
    const localCollectionOfNotesState = appStore((state) => state.localCollectionOfNotesState) as DisplayNote[]
    const setlocalCollectionOfNotesState = appStore((state) => state.setlocalCollectionOfNotesState)


    const [openRename, setRenameOpen] = useState(false);
    const [renameNoteId, setRenameNoteId] = useState<string>("");
    const [renameNoteName, setRenameNoteName] = useState<string>("");
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteNoteId, setDeleteNoteId] = useState<string|null>("");
    const [deleteNoteName, setDeleteNoteName] = useState<string|null>("");


    const setShowLoadingPage = appStore((state) => state.setShowLoadingPage)

    const [loadingDisplayNotes, setLoadingDisplayNotes] = useState(true);

    const { data: session } = useSession();

    const userDetails = appStore((state) => state.userDetails)
    const setUserDetails = appStore((state) => state.setUserDetails)

    useEffect(() => {
        if (!userDetails && session?.user?.email) {
            const fetchingUserDetails = async () => {
                setShowLoadingPage(true);
                const res = await getUserDetailsFromEmail(session?.user?.email as string);
                setUserDetails(res);
                console.log("fetched user details via email: ", res);
                setShowLoadingPage(false);
            }
            fetchingUserDetails();
        }
    }, [session])



    useEffect(() => {
        if (localCollectionOfNotesState == null && userDetails != null) {
            const asyncDisplayNotes = async () => {
                console.log("fetching display notes")
                setlocalCollectionOfNotesState(await getDisplayNotes(userDetails.userId));
            }
            asyncDisplayNotes();
        }

    }, [userDetails])








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

        <Tab tabName="Documents Manager" />

        <Dialog open={openRename} onOpenChange={(e) => {
            setRenameOpen(e);
            // console.log(e);
            setRenameNoteId("");
            setRenameNoteName("");
        }}>



            <DialogContent className={`${styles.renameDialog}`}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    setRenameOpen(false);
                    renameNote(renameNoteId, renameNoteName);
                    // refreshToggle.current+=1;
                    // console.log("refresh: ", refreshToggle)
                    console.log("renaming ", renameNoteId, " to ", renameNoteName);
                }}>
                    <DialogHeader>
                        <DialogTitle>Rename Document</DialogTitle>
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
                        <Button className={styles.renameBtn} type="submit" >Rename</Button>
                        <Button onClick={() => { setRenameOpen(false) }} className={styles.cancelRename}>Cancel</Button>
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
                    deleteNote(deleteNoteId as string);
                    setlocalCollectionOfNotesState(localCollectionOfNotesState.filter(x => x.id != deleteNoteId))
                }}>
                    <DialogHeader>
                        <DialogTitle>Delete note</DialogTitle>
                        <DialogDescription>
                            Delete <b>{deleteNoteName}</b> permanenetly?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className={styles.dialogFooter}>
                        <Button className={styles.deleteBtn}>Delete</Button>
                        <Button onClick={() => { 
                            setOpenDelete(false);
                            setDeleteNoteId(null);
                            setDeleteNoteName(null);
                         }} className={styles.cancelDelete}>Cancel</Button>
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
                                    {/* <DropdownMenuItem onClick={() => {
                                        console.log(" share")
                                    }}>Share</DropdownMenuItem> */}
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
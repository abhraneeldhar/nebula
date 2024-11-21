"use client"
import styles from "./allnotes.module.css"
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import closeSVG from "../../../public/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import menuSVG from "../../../public/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import { appStore } from "@/app/store";
import { useEffect, useState } from "react";
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


export default function AllNotesComponent() {
    const router = useRouter();
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



    const [openRename, setRenameOpen] = useState(false);




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

        <Dialog open={openRename} onOpenChange={setRenameOpen}>
            {/* <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger> */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value="Pedro Duarte" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input id="username" value="@peduarte" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


        <div className={styles.main}>
            <NewNoteBtn />
            <div className={styles.notesContainer}>

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

                            <DropdownMenuContent className="w-30" onClick={(e) => {
                                e.stopPropagation();
                            }}>
                                <DropdownMenuGroup>

                                    <DropdownMenuItem onClick={() => {
                                        console.log(" rename");
                                        setRenameOpen(true);
                                    }}>Rename</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        console.log(" share")
                                    }}>Share</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className={styles.deleteBtn} onClick={() => {
                                        console.log(" delete")
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
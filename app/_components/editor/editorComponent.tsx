"use client"
import Quill from "quill"
import React, { useEffect, useId, useRef, useState } from "react"
import "quill/dist/quill.snow.css"

import "./editor.css"
import styles from "./editor.module.css"

import Image from "next/image"
import menuSVG from "../../../public/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"

import { Button } from "@radix-ui/themes"
import { useSidebar } from "@/components/ui/sidebar"
import { appStore } from "@/app/store"


import { DisplayNote, Note, userType } from "@/app/utils/fileFormat"

import { useSession } from "next-auth/react"
import { Delta } from "quill/core"

import { postNote } from "@/app/utils/postNote"
import { Input } from "@/components/ui/input"
import { getOneNote } from "@/app/utils/getOneNote"
import { getDisplayNotes } from "@/app/utils/getDisplayNotes"

import { Spinner } from "@radix-ui/themes"

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { getFriends } from "@/app/utils/shareMechanics/getFriends"
import { Circle, CircleCheckBig } from "lucide-react"
import { shareToFriends } from "@/app/utils/shareMechanics/shareToFreinds"
import { FriendSearch } from "@/app/utils/shareMechanics/searchFriends"
import { getUserDetailsFromEmail } from "@/app/utils/getUserDetailsFromEmail"
// import { title } from "process"



export default function EditorComponent({ id }: { id: string }) {
    const setShowLoadingPage = appStore((state) => state.setShowLoadingPage)


    const localCollectionOfNotesState = appStore((state) => state.localCollectionOfNotesState) as DisplayNote[];
    const setlocalCollectionOfNotesState = appStore((state) => state.setlocalCollectionOfNotesState);

    const [loadingEditorState, setLoadingEditorState] = useState(true);
    const [savingState, setSavingState] = useState(false);


    // const [userId, setUserId] = useState<string | null>(null)
    const { data: session } = useSession();

    const userDetails = appStore((state) => state.userDetails)
    const setUserDetails = appStore((state) => state.setUserDetails)

    useEffect(() => {
        if (!userDetails && session?.user?.email) {
            const fetchingUserDetails = async () => {
                setShowLoadingPage(true);
                console.log("getting user details");
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


    const currentOpenNoteId = id;
    const [noteData, setNoteData] = useState<Note | null>()

    const [currentNoteTitle,setCurrentNoteTitle]=useState<string|null>()
    // gets current open note data
    useEffect(() => {
        if (userDetails) {
            const getNoteData = async () => {
                console.log("getting current note data")
                setLoadingEditorState(true);
                const response = await getOneNote(userDetails.userId as string, currentOpenNoteId as string) as Note
                setCurrentNoteTitle(response.title);
                setNoteData(response);
                setLoadingEditorState(false);
            }
            getNoteData();
        }
    }, [userDetails])


    const [shareDialogboxOpen, setShareDialogboxOpen] = useState(false)

    const Tab = () => {
        const { toggleSidebar } = useSidebar();
        return (<>
            <div className={styles.tabBar}>
                <div className={styles.tabContent}>
                    <div className={styles.tabnameContainer}>
                        <div className={styles.sidebarBtn}>
                            <Image src={menuSVG} alt="X" onClick={() => {
                                toggleSidebar();
                            }
                            } />
                        </div>
                        <Input disabled={loadingEditorState} defaultValue={currentNoteTitle||""} placeholder="Untitled Note" className={styles.tabName} onBlur={(e)=>{setCurrentNoteTitle(e.target.value)}}
                        />
                    </div>


                    <div className={styles.tabButtons}>
                        <Button className={styles.shareBtn} onClick={() => {
                            console.log("share btn press")
                            setShareDialogboxOpen(true);
                        }}>Share</Button>

                        <Button loading={savingState} disabled={savingState || loadingEditorState} className={styles.saveBtn} onClick={async() => {
                            await saveFunction();
                            toast.success("Saved", { position: "bottom-center",autoClose: 500, theme: "dark" });
                        }}>Save</Button>
                    </div>
                </div>
            </div>
        </>)
    }


    const toolbarRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null)
    const tabNameRef = useRef<HTMLInputElement>(null)


    const toolbarOptions = [
        [{ 'header': '1' }, { 'header': '2' }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'color': [] }, { 'background': [] }, 'link'],
        [{ 'align': [] }, { 'list': 'ordered' }, { 'list': 'bullet' }],
        // ['link', 'image'],
        // ['undo','redo']
    ];


    useEffect(() => {
        // const quill = new Quill("#container", { theme: "snow", modules: { toolbar: toolbarOptions } });
        const quill = new Quill('#container', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions,
                history: {
                    delay: 1000,
                    maxStack: 50,
                    userOnly: true,
                },
            },
        });

        quillRef.current = quill;
        quill.root.setAttribute('spellcheck', "false")
        // quill.setContents([]);
        const undoBtn = document.querySelector(".ql-undo")
        const redoBtn = document.querySelector(".ql-redo")
        const toolbar = document.querySelector(".ql-toolbar")
        undoBtn?.addEventListener("click", () => { quillRef.current?.history.undo() })
        redoBtn?.addEventListener("click", () => { quillRef.current?.history.redo() })

        if (!noteData) {
            quillRef.current.setText("")
        }
        else {
            quillRef.current.setContents(noteData.content)
            // if (tabNameRef.current) {
            //     tabNameRef.current.value = noteData.title;
            // }
        }

        return (() => {
            if (toolbarRef.current) {
                toolbarRef.current.innerHTML = ""
            }
            if (toolbar) {
                toolbar.remove()
            }
            undoBtn?.removeEventListener("click", () => { quillRef.current?.history.undo() })
            redoBtn?.removeEventListener("click", () => { quillRef.current?.history.redo() })
        })
    }, [, currentOpenNoteId, noteData])

    const updateLocalCollection = (currentNote: Note) => {
        const existingNoteIndex = localCollectionOfNotesState.findIndex(
            (note: DisplayNote) => note.id === currentNote.id
        );

        if (existingNoteIndex !== -1) {
            // Update existing note
            const updatedNote = {
                ...localCollectionOfNotesState[existingNoteIndex],
                title: currentNote.title,
                snippet: currentNote.snippet,
                lastModifiedAt: currentNote.lastModifiedAt
            };
            setlocalCollectionOfNotesState([
                ...localCollectionOfNotesState.slice(0, existingNoteIndex),
                updatedNote,
                ...localCollectionOfNotesState.slice(existingNoteIndex + 1)
            ]);
        } else {
            // Add new note
            const newNote: DisplayNote = {
                owner: currentNote.owner,
                id: currentNote.id,
                type: "Note",
                snippet: currentNote.snippet,
                parent: {
                    folderId: currentNote.parent.folderId,
                    folderName: currentNote.parent.folderName
                },
                title: currentNote.title,
                createdAt: currentNote.createdAt,
                lastModifiedAt: currentNote.lastModifiedAt
            };
            setlocalCollectionOfNotesState([newNote, ...localCollectionOfNotesState]);
        }
    };


    // saving the note
    const saveFunction = async () => {
        const noteSnippet = quillRef.current?.getText() as string
        if (userDetails) {
            setSavingState(true);
            const newNote: Note = {
                owner: userDetails.userId,
                id: currentOpenNoteId,
                createdAt: noteData?.createdAt as number,
                lastModifiedAt: Number(new Date()),
                content: quillRef.current?.getContents() as Delta,
                type: "Note",
                snippet: noteSnippet.slice(0, 70) + "...",
                title: currentNoteTitle || "Untitled",
                parent: {
                    folderId: null,
                    folderName: "root"
                }
            }
            const res = await postNote(JSON.stringify(newNote));
            setSavingState(false);
            updateLocalCollection(newNote)
        }
    }

    // autosaving
    const mainDivRef=useRef<HTMLDivElement>(null);
    const handleBlur = async (event: React.FocusEvent<HTMLDivElement>) => {
        if (!mainDivRef.current?.contains(event.relatedTarget)) {
          await saveFunction();
        }
      };


    const [searchedFriendsList, setSearchedFriendsList] = useState<any>([])
    const [shareFirendsDetailsList, setShareFirendsDetailsList] = useState<userType[]>([])
    const [selectedFriends, setSelectedFriends] = useState<string[]>([])
    const shareSearchInputRef = useRef<HTMLInputElement>(null);
    const [searchParam, setSearchparam] = useState<string>()

    useEffect(() => {
        setSelectedFriends([]);
        setSearchparam("");
        if (userDetails?.userId && shareDialogboxOpen) {
            const f = async () => {
                const friendDetails = await getFriends(userDetails.userId)
                if (friendDetails != shareFirendsDetailsList) {
                    setShareFirendsDetailsList(friendDetails)
                }
                setSelectedFriends([]);
            }
            f();
        }

    }, [userDetails, shareDialogboxOpen])

    const handleSelection = (userId: string) => {
        if (!selectedFriends.includes(userId)) {
            setSelectedFriends([...selectedFriends, userId])
        }
        else {
            setSelectedFriends(selectedFriends.filter((id) => {
                if (id != userId) {
                    return true
                }
                else {
                    return false
                }
            }))
        }
    }
    const handleShareSearch = async (searchParam: string) => {
        if (userDetails && searchParam != " " && searchParam != "") {
            const res = await FriendSearch(userDetails.userId, searchParam);
            setSearchedFriendsList(res);
        }
        if (searchParam == "" || searchParam == " ") {
            setSearchedFriendsList([])
        }
    }
    const shareAction = async () => {
        if (userDetails && noteData && selectedFriends.length > 0) {
            toast.info("Sending", { position: "bottom-center", theme: "dark" })
            const res = await shareToFriends(userDetails.userId, selectedFriends, noteData);
            console.log("sent to", selectedFriends);
            setSelectedFriends([]);
            setSearchparam("");
            toast.success("Sent", { position: "bottom-center",autoClose: 500, theme: "dark" })
        }
        setShareDialogboxOpen(false);
    }

    return (<>
        <div className={styles.main} ref={mainDivRef} onBlur={handleBlur}>
            <Tab />
            <Dialog open={shareDialogboxOpen} onOpenChange={setShareDialogboxOpen} defaultOpen={true}>
                <DialogContent className={styles.shareDialogContent}>
                    <DialogHeader>
                        <DialogTitle>Share</DialogTitle>
                        <DialogDescription>
                            Share your note with friends
                        </DialogDescription>
                    </DialogHeader>

                    <Input ref={shareSearchInputRef} className={styles.shareInput} placeholder="search for friends.." onChange={(e) => {
                        handleShareSearch(e.target.value);
                        setSearchparam(e.target.value);
                    }} />
                    <div className={styles.searchResultContainer}>

                        {(searchedFriendsList && searchedFriendsList.length > 0 && searchParam) && (searchedFriendsList.map((friendDetail: userType) => (
                            <div className={styles.reqPersonCard} key={friendDetail.userId} onClick={() => { handleSelection(friendDetail.userId) }} >
                                <div className={styles.reqProfilePic}>
                                    <Image src={friendDetail.imageUrl} alt="pfp" height={50} width={50} unoptimized={true} />
                                    <div className={styles.reqNameHolder}>
                                        <p className={styles.reqName}>{friendDetail.name}</p>
                                        <p className={styles.reqUsername}>@{friendDetail.userName}</p>
                                    </div>
                                </div>
                                <div>
                                    {selectedFriends.includes(friendDetail.userId) ? <CircleCheckBig color="#7CFC00" /> : <Circle />}
                                </div>
                            </div>
                        ))
                        )}


                        {(!searchParam && shareFirendsDetailsList && shareFirendsDetailsList.length > 0) && (shareFirendsDetailsList.map((friendDetail: userType) => (
                            <div className={styles.reqPersonCard} key={friendDetail.userId} onClick={() => { handleSelection(friendDetail.userId) }} >
                                <div className={styles.reqProfilePic}>
                                    <Image src={friendDetail.imageUrl} alt="pfp" height={50} width={50} unoptimized={true} />
                                    <div className={styles.reqNameHolder}>
                                        <p className={styles.reqName}>{friendDetail.name}</p>
                                        <p className={styles.reqUsername}>@{friendDetail.userName}</p>
                                    </div>
                                </div>
                                <div>
                                    {selectedFriends.includes(friendDetail.userId) ? <CircleCheckBig color="#7CFC00" /> : <Circle />}
                                </div>
                            </div>
                        ))
                        )}

                        {
                            !shareFirendsDetailsList && (<><Spinner className={styles.friendCardSpinner} /></>)
                        }
                    </div>

                    <div className={styles.actionButtonContainer}>
                        <Button className={styles.closeDialogBtn} onClick={() => {
                            setShareDialogboxOpen(false);
                            setSelectedFriends([]);
                            setSearchparam("");
                        }}>Close</Button>
                        <Button className={styles.shareDialogBtn} onClick={() => { shareAction() }} disabled={selectedFriends.length == 0}>Share</Button>
                    </div>
                </DialogContent>
            </Dialog>


            {loadingEditorState && !noteData && (
                <div className={styles.containerLoaderContainer}>
                    <Spinner size="3" className={styles.containerSpinner} />
                </div>
            )}
            <ToastContainer />
            <div className={styles.editorSection}>
                <div id="container" ref={toolbarRef}>
                </div>
            </div>
        </div>
    </>
    )
}
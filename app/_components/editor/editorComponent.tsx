"use client"
import Quill from "quill"
import React, { useEffect, useRef, useState } from "react"
import "quill/dist/quill.snow.css"

import "./editor.css"
import styles from "./editor.module.css"

import Image from "next/image"
import closeSVG from "../../../public/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import menuSVG from "../../../public/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { appStore } from "@/app/store"


import { Note, CollectionOfNotes } from "@/app/utils/fileFormat"
import { fetchUserId } from "@/app/utils/fetchUserId"

import { useSession } from "next-auth/react"
import { Delta } from "quill/core"




import { postNote } from "@/app/utils/postNote"
import { Input } from "@/components/ui/input"
import { getOneNote } from "@/app/utils/getOneNote"

export default function EditorComponent({ id }: { id: string }) {
    // gets the user id
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
        if (userId) {
            console.log("userid>>>>", userId)
        }
    }, [userId])


    const currentOpenNoteId = id;

    const [noteData, setNoteData] = useState<Note>()

    useEffect(() => {
        if (userId) {

            const getNoteData = async () => {
                // const noteData = await getOneNote(userId as string, currentOpenNoteId as string);
                const response=await getOneNote(userId as string, currentOpenNoteId as string)
                if (response.status==403){
                    console.log("we fucked up");
                }
                else{
                    setNoteData(response);
                }
                // console.log("userid>>>",userId," noteid>>>",currentOpenNoteId);
            }
            getNoteData();
        }
    }, [userId])
    useEffect(()=>{
        console.log("notedata>>>>>>", noteData)
        
    },[noteData])


    const SaveButton = () => {
        return (
            <Button className={styles.saveBtn} onClick={() => {
                saveFunction()
            }}>Save</Button>
        )
    }

    const Tab = ({ tabName }: { tabName: string }) => {
        const { toggleSidebar, open } = useSidebar();
        return (<>
            <div className={styles.tabBar}>
                <div className={styles.tabnameContainer}>
                    <div className={styles.sidebarBtn}>
                        <Image src={open ? closeSVG : menuSVG} alt="sidebarBtn" onClick={() => {
                            toggleSidebar();
                        }
                        } />
                    </div>
                    <p><Input type="text" /></p>
                </div>
                <div className={styles.saveBtnContainer}>
                    <SaveButton />
                </div>
            </div>
        </>)
    }








   
    const toolbarRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null)
    const toolbarOptions = [
        [{ 'header': '1' }, { 'header': '2' }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }, { 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
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
        quill.setContents([]);
        const undoBtn = document.querySelector(".ql-undo")
        const redoBtn = document.querySelector(".ql-redo")
        const toolbar = document.querySelector(".ql-toolbar")
        undoBtn?.addEventListener("click", () => { quillRef.current?.history.undo() })
        redoBtn?.addEventListener("click", () => { quillRef.current?.history.redo() })

        if(!noteData){
            quillRef.current.setText("")
        }
        else{
            quillRef.current.setContents(noteData.content)
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
    }, [, currentOpenNoteId,noteData])



    const saveFunction = () => {
        if (userId) {
            const newNote: Note = {
                owner: userId,
                id: currentOpenNoteId,
                createdAt: noteData?.createdAt as number,
                lastModifiedAt: Number(new Date()),
                content: quillRef.current?.getContents() as Delta,
                type: "Note",
                title: "Test note title",
                parent: {
                    folderId: null,
                    folderName: "root"
                }
            }
            postNote(newNote);
        }
        else {
            console.log("userId not found")
        }
    }


    return (<>
        <Tab tabName="editor" />
        <div className={styles.editorSection}>
            <div id="container" ref={toolbarRef}>
            </div>
        </div>
        <button onClick={() => {
            console.log(quillRef.current?.getContents())
        }}>Get contents</button>
        <button onClick={() => {
            console.log(quillRef.current?.getText())
        }}>Get Text</button>
        <button onClick={() => {
            console.log(quillRef.current?.getSemanticHTML())
        }}>Get Semantic HTML</button>
    </>)
}
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
import local from "next/font/local"

import { Note, CollectionOfNotes } from "@/app/utils/fileFormat"

const SaveButton=()=>{
    return(
        <Button className={styles.saveBtn}>Save</Button>
    )
}



export default function EditorComponent({id}:{id:string}) {
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
                <p>{tabName}</p>
                </div>
                <div className={styles.saveBtnContainer}>
                    <SaveButton/>
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
    const [testToolbarOptions, setTestToolbarOptions] = useState(toolbarOptions)

    // const currentOpenNoteIdState = appStore((state) => state.currentOpenNoteIdState)
    const currentOpenNoteId=id;
    const localCollectionOfNotesState = appStore((state) => state.localCollectionOfNotesState) as CollectionOfNotes
    


    useEffect(() => {

        // const quill = new Quill("#container", { theme: "snow", modules: { toolbar: toolbarOptions } });

        const quill = new Quill('#container', {
            theme: 'snow',
            modules: {
                toolbar: testToolbarOptions,
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


        console.log(currentNote||"no note")
        quill.setText(String(currentNote?.content))
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
    }, [,currentOpenNoteId])
    // fiz thisusing zustand state for current note

   
    const localCollectionOfNotes = appStore((state) => state.localCollectionOfNotesState) as CollectionOfNotes

    const currentNote = localCollectionOfNotes.notes?.find((note) => note.id === currentOpenNoteId)

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
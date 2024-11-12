"use client"
import styles from "./editor.module.css"
import { appStore } from "@/app/store"
import { useSidebar } from "@/components/ui/sidebar";
import { useRef, useEffect } from "react";
import Quill from "quill"
import "quill/dist/quill.snow.css"
import Image from "next/image";
import closeSVG from "../../../public/close_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import menuSVG from "../../../public/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import "./editor.css"

function EditorComponent() {

    const toolbarRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null)
    const toolbarOptions = [
        // [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'header': '1' }, { 'header': '2' }],
        // [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        // ['bold', 'italic', 'underline'],
        // [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'align': [] }, { 'list': 'ordered' }, { 'list': 'bullet' }],
        // ['link', 'image', 'video'],
        ['link', 'image'],
        // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        // [{ 'font': [] }],
        // ['clean'],
        ['undo', 'redo']
    ];

    const { toggleSidebar } = useSidebar();

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === 'Escape') {
                toggleSidebar();
                console.log("toggling");
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);



    useEffect(() => {
        const quill = new Quill("#container", { theme: "snow", modules: { toolbar: toolbarOptions } });
        quillRef.current = quill;
        quill.root.setAttribute('spellcheck', "false")

        const undoBtn = document.querySelector(".ql-undo")
        const redoBtn = document.querySelector(".ql-redo")
        undoBtn?.addEventListener("click", () => { quillRef.current?.history.undo() })
        redoBtn?.addEventListener("click", () => { quillRef.current?.history.redo() })



        return (() => {
            if (toolbarRef && toolbarRef.current) {
                toolbarRef.current.innerHTML = "";
            }
            undoBtn?.removeEventListener("click", () => { quillRef.current?.history.undo() })
            redoBtn?.removeEventListener("click", () => { quillRef.current?.history.redo() })
        })
    }, [])




    return (<>
        <div id="container" ref={toolbarRef}>

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
        <button onClick={() => { quillRef.current?.history.undo() }}>undo</button>
        <button onClick={() => { quillRef.current?.history.undo() }}>redo</button>


    </>)
}


export default function EditorPage() {
    const Tab = ({ tabName }: { tabName: string }) => {
        const { toggleSidebar, open } = useSidebar();
        return (<>
            <div className={styles.tabBar}>
                <div className={styles.sidebarBtn}>
                    <Image src={open ? closeSVG : menuSVG} alt="sidebarBtn" onClick={() => {
                        toggleSidebar()
                    }
                    } />
                </div>
                <p>{tabName}</p>
            </div>
        </>)
    }


    return (<>
        <Tab tabName="Editor"></Tab>
        <EditorComponent />
    </>)
}
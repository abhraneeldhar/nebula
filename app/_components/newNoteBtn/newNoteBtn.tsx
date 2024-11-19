"use client"
import Image from "next/image"
import newNoteIcon from "../../../public/edit_note_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
import styles from "./newNote.module.css"
import { useRouter } from "next/navigation"
useRouter
export default function NewNoteBtn(){
    const router=useRouter();
    return(<>
    <div className={styles.newNoteBtn} onClick={()=>{router.push("/editor")}}>
        <Image src={newNoteIcon} alt="+"/>
    </div>
    </>)
}
"use client"
import styles from "./newNote.module.css"
import { useRouter } from "next/navigation"
import { SquarePen } from "lucide-react"

export default function NewNoteBtn(){
    const router=useRouter();
    return(<>
    <div className={styles.newNoteBtn} onClick={()=>{router.push("/editor")}}>
        <SquarePen color="var(--variableText)" className={styles.squarePen}/>
    </div>
    </>)
}
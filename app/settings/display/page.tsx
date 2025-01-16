"use client"
import { ArrowBigLeft } from "lucide-react"
import styles from "./display.module.css"
import { useRouter } from "next/navigation"
export default function Displaysettings(){
    const router=useRouter();
    return(<>
    <div className={styles.tab}>
                    <div className={styles.back} onClick={()=>{router.back()}}>
                        <ArrowBigLeft />
                    </div>
                    <div className={styles.settingsHeader}>Display</div>
                </div>
    </>)
}
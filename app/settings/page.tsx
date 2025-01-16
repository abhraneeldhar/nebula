import styles from "./settings.module.css"


import { ArrowBigLeft } from "lucide-react"

export default function Settings() {
    return (<>
        <div className={styles.main}>

        <div className={styles.tab}>
            <div className={styles.back}>
                <ArrowBigLeft />
            </div>
            <div className={styles.settingsHeader}>Settings</div>
        </div>
        </div>
    </>)
}
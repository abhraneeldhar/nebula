import { Plus, PlusIcon, Users } from "lucide-react"
import styles from "./nexus.module.css"
import { Button } from "@radix-ui/themes"
export default function Nexus() {
    return (<>
        <div className={styles.main}>
            <h1 className={styles.header}>Welcome to NEXUS</h1>

            <div className={styles.roomCards}>
                <div className={styles.createRoom}>
                    <PlusIcon className={styles.icon}/>
                    <h1>Create Room</h1>
                    <p>Start a new room and invite others to join your session</p>
                    <Button><Plus/>Create Room</Button>
                </div>
            </div>
        </div>
    </>)
}
"use client"
import { ArrowLeft, CopyIcon, Send } from "lucide-react"
import styles from "./chatroom.module.css"
import { Button, Code, DataList, Flex, IconButton } from "@radix-ui/themes"
import { Input } from "@/components/ui/input"
export default function ChatRoomComp({ roomCode }: { roomCode: string }) {
    return (<>
        <div className={styles.main}>
            <div className={styles.chatComp}>
                <div className={styles.tab}>
                    <ArrowLeft className={styles.goBack} />
                    <div className={styles.roomCode}>
                       Room code : {roomCode}
                    </div>
                </div>
                <div className={styles.chatSection}>
                    hehe
                </div>
                <div className={styles.writeMessageDiv}>
                    <div className={styles.messageInput}>
                        <textarea />
                    </div>
                    <Button className={styles.sendBtn}><Send/></Button>
                </div>
            </div>
        </div>
    </>)
}
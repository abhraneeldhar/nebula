"use client"
import styles from "./chatroom.module.css"
export default function ChatRoomComp({roomCode}:{roomCode:string}){
    return(<>
        <div className={styles.main}>
            <div className={styles.chatComp}></div>
        </div>
    </>)
}
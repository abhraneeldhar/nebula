"use client"
import { Plus, PlusIcon, Users } from "lucide-react"
import styles from "./nexus.module.css"
import { Button } from "@radix-ui/themes"

import { supabase } from "../utils/supabase/client"
export default function Nexus() {

    const createRoom= async()=>{
        const roomCode=Math.floor(1000 + Math.random() * 9000).toString();

        console.log("checking for room")
        // checking for existing room
        const { data: roomMatch, error }= await supabase.from("chat_rooms").select().eq("roomcode",roomCode);
        console.log(roomMatch)
    }
    return (<>
        <div className={styles.main}>
            <h1 className={styles.header}>Welcome to NEXUS</h1>

            <div className={styles.roomCards}>
                <div className={styles.createRoom}>
                    <PlusIcon className={styles.icon}/>
                    <h1>Create Room</h1>
                    <p>Start a new room and invite others to join your session</p>
                    <Button onClick={()=>{createRoom()}}><Plus/>Create Room</Button>
                </div>

                <div className={styles.joinRoom}>
                    <Users className={styles.icon}/>
                    <h1>Join Room</h1>
                    <p>Enter a room code to join an existing collaboration session</p>
                    <Button ><Users/>Join Room</Button>
                </div>
            </div>
        </div>
    </>)
}
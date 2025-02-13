"use client"
import { Plus, PlusIcon, Users } from "lucide-react"
import styles from "./nexus.module.css"
import { Button, Dialog } from "@radix-ui/themes"

import { supabase } from "../utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
export default function Nexus() {
    const router = useRouter();

    const createRoom = async () => {
        const roomCode = Math.floor(1000 + Math.random() * 9000).toString();

        console.log("checking for room")
        // checking for existing room
        const { data: roomMatch, error } = await supabase.from("chat_rooms").select().eq("roomcode", roomCode);
        if (roomMatch) {
            if (roomMatch?.length > 0) {
                console.log("colision detected")
                createRoom();
                return;
            }
            else {
                const { data: creationData, error } = await supabase
                    .from("chat_rooms")
                    .insert([{ roomcode: roomCode }])
                    .select();
                if (creationData) {
                    console.log("created room at: ", creationData[0].roomcode);
                    router.push(`/nexus/${roomCode}`);
                }
                return error ? null : creationData;
            }

        }
    }



    const [showJoinDialog, setShowJoinDialog] = useState(false);
    const joinRoom = async () => {

    }

    return (<>
        <div className={styles.main}>

            <Dialog.Root open={showJoinDialog} onOpenChange={setShowJoinDialog}>
                <Dialog.Title />
                <Dialog.Description />
                <Dialog.Content className={styles.joinDialogBox}>

                    asdasda

                </Dialog.Content>
            </Dialog.Root>

            <h1 className={styles.header}>Welcome to NEXUS</h1>

            <div className={styles.roomCards}>
                <div className={styles.createRoom}>
                    <PlusIcon className={styles.icon} />
                    <h1>Create Room</h1>
                    <p>Start a new room and invite others to join your session</p>
                    <Button onClick={() => { createRoom() }}><Plus />Create Room</Button>
                </div>

                <div className={styles.joinRoom}>
                    <Users className={styles.icon} />
                    <h1>Join Room</h1>
                    <p>Enter a room code to join an existing collaboration session</p>
                    <Button onClick={() => { setShowJoinDialog(true) }} ><Users />Join Room</Button>
                </div>
            </div>
        </div>
    </>)
}
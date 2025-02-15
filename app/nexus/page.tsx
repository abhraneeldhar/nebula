"use client"
import { Plus, PlusIcon, Users } from "lucide-react"
import styles from "./nexus.module.css"
import { Button, Dialog } from "@radix-ui/themes"

import { supabase } from "../utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import Image from "next/image"
import nexusLogo from "../../public/landingpage/vortex logo.jpeg"

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
    const [inputOtp, setInputOtp] = useState<string | null>(null)
    const joinRoom = async () => {
        router.push(`/nexus/${inputOtp}`);
    }


    return (<>
        <div className={styles.main}>

            <Dialog.Root open={showJoinDialog} onOpenChange={(e) => {
                setShowJoinDialog(e);
                setInputOtp(null);
            }}>
                <Dialog.Title />
                <Dialog.Description />
                <Dialog.Content className={styles.joinDialogBox}>

                    <h1>Enter Room Code</h1>
                    <InputOTP maxLength={4} onChange={(e) => {
                        setInputOtp(e)
                    }}>
                        <InputOTPGroup className={styles.otpGroup}>
                            <InputOTPSlot className={styles.otpSlot} index={0} />
                            <InputOTPSlot className={styles.otpSlot} index={1} />
                            <InputOTPSlot className={styles.otpSlot} index={2} />
                            <InputOTPSlot className={styles.otpSlot} index={3} />
                        </InputOTPGroup>
                    </InputOTP>

                    <div className={styles.buttonSec}>
                        <Button onClick={() => setShowJoinDialog(false)} className={styles.cancelBtn}>Cancel</Button>
                        <Button disabled={!inputOtp || inputOtp.length == 0} onClick={() => { joinRoom() }} className={styles.joinBtn}>Join</Button>
                    </div>



                </Dialog.Content>
            </Dialog.Root>

            <h1 className={styles.header}>Welcome to NEXUS<Image src={nexusLogo} unoptimized alt=""/></h1>

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
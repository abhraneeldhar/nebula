"use client"
import { ArrowLeft, CopyIcon, Send } from "lucide-react"
import styles from "./chatroom.module.css"
import { Button, Code, DataList, Flex, IconButton } from "@radix-ui/themes"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { supabase } from "@/app/utils/supabase/client"


export default function ChatRoomComp({ roomCode }: { roomCode: string }) {
    const router = useRouter();

    const [messageArray, setMesasgeArray] = useState<any[] | null>([]);

    const listenToMessages = (roomCode: string, setMesasgeArray: any) => {

        supabase
            .from("messages")
            .select("*")
            .eq("roomcode", roomCode)
            .order("sentat", { ascending: true })
            .then(({ data }) => setMesasgeArray(data));

        const subscription = supabase
            .channel(`room_${roomCode}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages", filter: `roomcode=eq.${roomCode}` },
                (payload) => {
                    setMesasgeArray((prev: any[]) => [...(prev || []), payload.new]);
                    console.log("new msg: ", payload.new);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    };

    useEffect(() => {
        const unsubscribe = listenToMessages(roomCode, setMesasgeArray);
        return () => unsubscribe();
    }, [roomCode]);

    useEffect(() => {
        console.log("mesasges: ", messageArray)
    }, [messageArray])


    const senderId = 13031123002;
    const senderName = "Dhar";

    const msgTextRef = useRef<HTMLTextAreaElement>(null)
    const sendMessage = async () => {
        const msgText = msgTextRef?.current?.value || "";
        const { data, error } = await supabase.from("messages").insert({
            roomcode: roomCode,
            senderid: senderId,
            sendername: senderName,
            message: msgText
        });
        console.log(data)
        console.log(error)
        console.log("sent: ", msgText)
    };


    return (<>
        <div className={styles.main}>
            <div className={styles.chatComp}>
                <div className={styles.tab}>
                    <ArrowLeft className={styles.goBack} onClick={() => router.push("/nexus")} />
                    <div className={styles.roomCode}>
                        Room code : {roomCode}
                    </div>
                </div>
                <div className={styles.chatSection}>
                    {messageArray && messageArray.map((msg) => (
                        <p key={msg.id}> <strong>{msg.sendername}:</strong> {msg.message}</p>
                    ))}
                </div>
                <div className={styles.writeMessageDiv}>
                    <div className={styles.messageInput}>
                        <textarea ref={msgTextRef} />
                    </div>
                    <Button onClick={() => {
                        sendMessage();
                        if (msgTextRef.current) {

                            msgTextRef.current.value = ""
                        }
                    }} className={styles.sendBtn}><Send /></Button>
                </div>
            </div>
        </div>
    </>)
}
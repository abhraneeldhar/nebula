"use client"
import { ArrowLeft, CopyIcon, Dot, Send } from "lucide-react"
import styles from "./chatroom.module.css"
import { Button, Code, DataList, Flex, IconButton } from "@radix-ui/themes"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { supabase } from "@/app/utils/supabase/client"
import { useSession } from "next-auth/react"
import { appStore } from "@/app/store"
import { getUserDetailsFromEmail } from "@/app/utils/getUserDetailsFromEmail"
import { v4 as uuidv4 } from "uuid";
import { getRandomImage, getRandomName } from "@/app/utils/nexus/getRandomUser"

interface nexusUser {
    userId: string,
    name: string,
    imageUrl: string
}

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



    const userDetails = appStore((state) => state.userDetails)
    const setUserDetails = appStore((state) => state.setUserDetails)
    const { data: session } = useSession();

    useEffect(() => {
        if (!userDetails && session?.user?.email) {
            const fetchingUserDetails = async () => {
                // setShowLoadingPage(true);
                console.log("fetching user details via email");
                const res = await getUserDetailsFromEmail(session?.user?.email as string);
                setUserDetails(res)
                // setShowLoadingPage(false);
            }
            fetchingUserDetails();
        }
    }, [session])



    const [nexusUserDetails, setNexusUserDetails] = useState<nexusUser | null>(null)
    useEffect(() => {
        const storedUser: nexusUser = JSON.parse(localStorage.getItem("guestUser") || "null") || null;

        if (userDetails) {
            setNexusUserDetails({
                userId: userDetails?.userId as string,
                name: userDetails?.name as string,
                imageUrl: userDetails?.imageUrl as string

            });
        } else if (storedUser) {
            setNexusUserDetails(storedUser);
            console.log("got nexususer from lc  ", storedUser)
        } else {
            const makeNewUser = async () => {
                const guestUser = {
                    userId: uuidv4(),
                    name: await getRandomName(),
                    imageUrl: await getRandomImage() || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhH5Q4N_p5U6Xxt0usWjsAmsI5GrPkkb3Hkw&s"
                };
                setNexusUserDetails(guestUser);
                localStorage.setItem("guestUser", JSON.stringify(guestUser));
                console.log("new user made:", guestUser);
            }
            makeNewUser();
        }

    }, [, userDetails]);


    const msgTextRef = useRef<HTMLTextAreaElement>(null)
    const sendMessage = async () => {
        const msgText = msgTextRef?.current?.value || "";
        if(msgText==""){
            return;
        }
        if (nexusUserDetails) {
            const { error } = await supabase.from("messages").insert({
                roomcode: roomCode,
                senderid: nexusUserDetails?.name,
                sendername: nexusUserDetails?.name,
                senderimageurl: nexusUserDetails?.imageUrl,
                message: msgText
            });
            console.log(error)
            console.log("sent: ", msgText)
        }
        else {
            console.log("nexus no user")
        }
    };


    return (<>
        <div className={styles.main}>
            <div className={styles.chatComp}>
                <div className={styles.tab}>
                    <ArrowLeft className={styles.goBack} onClick={() => router.push("/nexus")} />
                    <div className={styles.roomCode}>
                        <h1>Room  {roomCode}</h1>
                        <p>Users online</p>
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
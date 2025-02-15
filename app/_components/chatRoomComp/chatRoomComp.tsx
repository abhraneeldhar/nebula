"use client"
import { ArrowLeft, Copy, CopyIcon, Dot, Send } from "lucide-react"
import styles from "./chatroom.module.css"
import { Button, Code, DataList, Flex, IconButton, ScrollArea } from "@radix-ui/themes"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { KeyboardEventHandler, useEffect, useRef, useState } from "react"
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
                    // console.log("new msg: ", payload.new);
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



    const [showLoadingPage, setShowLoadingPage] = useState(true);
    // const userDetails = appStore((state) => state.userDetails)
    const setUserDetails = appStore((state) => state.setUserDetails)
    const { data: session, status: sessionstatus } = useSession();



    const [nexusUserDetails, setNexusUserDetails] = useState<nexusUser | null>(null)
    useEffect(() => {
        // setShowLoadingPage(true);
        console.log("session is", sessionstatus);
        if (sessionstatus == "loading" || nexusUserDetails) {
            return;
        }
        else if (sessionstatus == "authenticated") {
            const fetchingUserDetails = async () => {
                // console.log("fetching user details via email");
                const res = await getUserDetailsFromEmail(session?.user?.email as string);
                setUserDetails(res);
                // console.log("using userdetails details");
                setNexusUserDetails({
                    userId: res?.userId as string,
                    name: res?.name as string,
                    imageUrl: res?.imageUrl as string
                });
            }
            fetchingUserDetails();
        }


        else if (sessionstatus == "unauthenticated") {
            const storedUser: nexusUser = JSON.parse(localStorage.getItem("guestUser") || "null") || null;
            if (storedUser) {
                // console.log("got nexususer from lc  ", storedUser)
                setNexusUserDetails(storedUser);
            }
            else {
                const makeNewUser = async () => {
                    const guestUser = {
                        userId: uuidv4(),
                        name: await getRandomName(),
                        imageUrl: await getRandomImage() || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhH5Q4N_p5U6Xxt0usWjsAmsI5GrPkkb3Hkw&s"
                    };
                    setNexusUserDetails(guestUser);
                    localStorage.setItem("guestUser", JSON.stringify(guestUser));
                    // console.log("new user made:", guestUser);

                }
                makeNewUser();
            }
        }

    }, [session])


    const [currentUsers, setCurrentUsers] = useState<any[]>([])
    useEffect(() => {
        // console.log("hello everybody i am, ", nexusUserDetails);
        const channel = supabase.channel(roomCode, { config: { presence: { key: nexusUserDetails?.userId } } });
        if (nexusUserDetails) {
            setShowLoadingPage(false);


            channel.subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ name: nexusUserDetails?.name, status: 'online' });
                }
            });

            channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
                // console.log(`User ${key} joined the room:`, newPresences);
                setMesasgeArray((messages) => [...(messages || []), {
                    type: "info",
                    name: newPresences[0].name,
                    action: "joined"
                }])
            });

            channel.on("presence", { event: "leave" }, ({ key, leftPresences }) => {
                // console.log("left name: ",leftPresences[0].name);            
                setMesasgeArray((messages) => [...(messages || []), {
                    type: "info",
                    name: leftPresences[0].name,
                    action: "left"
                }])
            });

            channel.on('presence', { event: 'sync' }, () => {
                const presenceState = channel.presenceState();
                const usersArray = Object.values(presenceState).flatMap(userList => userList);
                // console.log('Current users in room:', usersArray);
                setCurrentUsers(usersArray);
            });
            
        }
        return () => {
            channel.unsubscribe();
        };
    }, [nexusUserDetails])

    const messagesEndRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messageArray]);



    const msgTextRef = useRef<HTMLTextAreaElement>(null);
    const sendMessage = async () => {
        const msgText = msgTextRef?.current?.value || "";
        if (!msgText.trim()) {
            return;
        }
        if (msgTextRef.current) {
            msgTextRef.current.value = "";
        }
        if (nexusUserDetails) {
            const { error } = await supabase.from("messages").insert({
                roomcode: roomCode,
                senderid: nexusUserDetails?.userId,
                sendername: nexusUserDetails?.name,
                senderimageurl: nexusUserDetails?.imageUrl,
                message: msgText.trim()
            });

            // console.log(error)
            // console.log("sent: ", msgText)
        }
        else {
            console.log("nexus no user")
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.ctrlKey && e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
        }
    };


    return (<>
        {showLoadingPage && <div className={styles.nexusLoadingPage}>
            Joining Room
        </div>}
        {/* <ToastContainer transition={Flip} /> */}
        <div className={styles.main}>

            <div className={styles.tab}>
                <ArrowLeft className={styles.goBack} onClick={() => router.push("/nexus")} />
                <div className={styles.roomCode}>
                    <h1>Room  {roomCode}</h1>
                    <p>{currentUsers?.length} Users online</p>
                </div>
            </div>

            <div className={styles.chatSection}>

                <ScrollArea className={styles.chatScrollSec} type="always" scrollbars="vertical">
                    {messageArray && messageArray.map((msg, index) => {
                        if (msg.type == "info") {
                            return (
                                <div className={styles.joinLeftMsg} key={index}>
                                    <p>
                                        {msg.name} {msg.action}
                                    </p>
                                </div>)
                        }
                        const isFirstInSeq = index === 0 || messageArray[index - 1].senderid !== msg.senderid;
                        const isCode = msg.message.includes("\n") && msg.message.includes("  ");

                        return (
                            <div key={index} className={`${styles.messageBox} ${msg.senderid == nexusUserDetails?.userId ? `${styles.sent}` : `${styles.received}`
                                } ${isFirstInSeq ? `${styles.firstInSequence}` : `${styles.continuation}`}`}>

                                {isFirstInSeq && (
                                    <div className={styles.senderInfo}>
                                        <img src={msg.senderimageurl} alt="" className={styles.avatar} />
                                        <span className={styles.senderName}>{msg.sendername}</span>
                                    </div>
                                )}

                                <pre className={styles.messageText}>{msg.message}</pre>
                                {isCode && (<div className={styles.copyCodeBtn} onClick={() => { copyToClipboard(msg.message) }}>Copy Code <Copy /></div>)}

                            </div>
                        )
                    })}
                    <div className={styles.endDiv} ref={messagesEndRef} />
                </ScrollArea>
            </div >

            <div className={styles.writeMessageDiv}>
                <div className={styles.messageInput}>
                    <textarea placeholder="white your message here" spellCheck={false} ref={msgTextRef} onKeyDown={handleKeyDown} />
                </div>
                <Button type="submit" onClick={() => {
                    sendMessage();
                }} className={styles.sendBtn}><Send /></Button>
            </div>

        </div >


    </>)
}
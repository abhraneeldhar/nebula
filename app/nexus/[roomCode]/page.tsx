import ChatRoomComp from "@/app/_components/chatRoomComp/chatRoomComp";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image"
import arnoldStop from "../../../public/nexus/arnoldStop.jpg"
import styles from "../nexus.module.css"
import { Button } from "@radix-ui/themes";
import { ArrowLeft, ArrowRightLeft } from "lucide-react";
export default async function ChatRoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
    const roomCode = (await params).roomCode;

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: checkRoom, error } = await supabase.from("chat_rooms").select().eq("roomcode", roomCode);
    if (checkRoom?.length == 0) {
        return (<>
        <div className={styles.notFoundMain}>
            <Image src={arnoldStop} alt="room doesn't exist"/>
            <h1>The room you are trying to join doesnot exists</h1>
            <a href="/nexus"><Button>
            <ArrowLeft/>Go Back</Button></a>
        </div>
        </>)
    }
    else {
        return (<>
            <ChatRoomComp roomCode={roomCode} />
        </>)
    }
}
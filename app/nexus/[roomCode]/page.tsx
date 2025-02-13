import ChatRoomComp from "@/app/_components/chatRoomComp/chatRoomComp";
import { createClient } from "@supabase/supabase-js";

export default async function ChatRoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
    const roomCode = (await params).roomCode;

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: checkRoom, error } = await supabase.from("chat_rooms").select().eq("roomcode", roomCode);
    if (checkRoom?.length == 0) {
        return (<>no room here mf</>)
    }
    else {
        return (<>
            <ChatRoomComp roomCode={roomCode} />
        </>)
    }
}
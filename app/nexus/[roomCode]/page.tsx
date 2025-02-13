import ChatRoomComp from "@/app/_components/chatRoomComp/chatRoomComp";

export default async function ChatRoomPage({ params }: { params: Promise<{ roomCode: string }> }){
    const roomCode = (await params).roomCode;
    return(<>
        <ChatRoomComp roomCode={roomCode}/>
    </>)
}
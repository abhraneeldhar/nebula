import { supabase } from "../supabase/client";
export async function deleteEmptyRooms() {

    var emptyRoomCodes: string[] = []

    const { data: chat_rooms, error } = await supabase
        .from('chat_rooms')
        .select()
    if (chat_rooms) {
        chat_rooms.forEach((room) => {
            const channel = supabase.channel(room.roomcode);

            channel.subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ name: "voyager", status: 'online' });
                }
            });

            channel.on('presence', { event: 'sync' }, () => {
                const presenceState = channel.presenceState();
                const usersArray = Object.values(presenceState).flatMap(userList => userList);
                if (usersArray.length == 0) {
                    console.log("trynna delete ",room.roomcode);
                    deleteRoom(room.roomcode);
                    emptyRoomCodes.push(room.roomcode);
                }
                channel.unsubscribe();
            });



        })
    }
    else {
        console.log(error)
    }
}

export async function deleteRoom(roomcode: string) {
    const response = await supabase
        .from('chat_rooms')
        .delete()
        .eq('roomcode', roomcode)
    // console.log(response);
}

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export async function GET(request: Request) {
  console.log("Cron job started at:", new Date().toISOString());

  const authHeader = request.headers.get('authorization');
  console.log("Received authorization header:", authHeader);

  if (!authHeader) {
    console.error("Authorization header is missing");
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log("Invalid authentication token");
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  console.log("Authentication successful");

  async function deleteRoom(roomcode: string) {
    console.log("Attempting to delete room:", roomcode);
    const response = await supabase
      .from('chat_rooms')
      .delete()
      .eq('roomcode', roomcode);
    console.log("Delete response:", response);
    return response.data;
  }

  async function deleteEmptyRooms() {
    console.log("Starting deleteEmptyRooms function");
    var emptyRoomCodes: string[] = [];

    const { data: chat_rooms, error } = await supabase
      .from('chat_rooms')
      .select();

    if (error) {
      console.error("Error fetching chat rooms:", error.message);
      throw error;
    }

    if (!chat_rooms || chat_rooms.length === 0) {
      console.log("No chat rooms found");
      return;
    }

    console.log("Found", chat_rooms.length, "chat rooms");

    chat_rooms.forEach((room) => {
      console.log("Processing room:", room.roomcode);
      
      const channel = supabase.channel(room.roomcode);
      console.log("Subscribing to channel:", room.roomcode);

      channel.subscribe(async (status) => {
        console.log("Subscription status:", status);
        if (status === 'SUBSCRIBED') {
          console.log("Tracking presence for room:", room.roomcode);
          await channel.track({ name: "voyager", status: 'online' });
        }
      });

      channel.on('presence', { event: 'sync' },async () => {
        console.log("Presence sync triggered for room:", room.roomcode);
        const presenceState = channel.presenceState();
        const usersArray = Object.values(presenceState).flatMap(userList => userList);
        console.log("Users in room:", usersArray);

        if (usersArray.length == 0) {
          console.log("Room is empty, attempting to delete:", room.roomcode);
          const deletedCount = await deleteRoom(room.roomcode);
          console.log("Deleted count:", deletedCount);
          emptyRoomCodes.push(room.roomcode);
        }
      });

      // console.log("Unsubscribing from channel:", room.roomcode);
      // channel.unsubscribe();
    });

    console.log("Finished processing all rooms");
    console.log("Rooms marked for deletion:", emptyRoomCodes);
    return emptyRoomCodes;
  }

  console.log("Calling deleteEmptyRooms function");
  try {
    const roomsToDelete = await deleteEmptyRooms();
    console.log("Total rooms deleted:", roomsToDelete?.length);
  } catch (error) {
    console.error(error);
  }

  console.log("API call completed successfully");
  return NextResponse.json({
    message: "Cron job completed"  });
}
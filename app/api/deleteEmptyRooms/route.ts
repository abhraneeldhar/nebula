import { deleteEmptyRooms } from "@/app/utils/nexus/cleanupRooms";
export async function DELETE(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }
    await deleteEmptyRooms();
    return new Response("deleted empty rooms")
    
}
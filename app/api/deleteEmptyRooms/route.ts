import { deleteEmptyRooms } from "@/app/utils/nexus/cleanupRooms";
export function DELETE(request: Request) {
    deleteEmptyRooms();
    
}
"use server"
import { Note } from "../fileFormat";
import { mongoClientCS } from "../mongoConnector"

interface sharedNotePackage{
    senderId:string,
    receiverId:string,
    sharedAt:number,
    sharedNote:Note
}
export async function shareToFriends(senderId:string,selectedFriends:string[],noteData:Note){
    await mongoClientCS.connect();
    const db=mongoClientCS.db("notesApp");
    const sharedNotes=db.collection("sharedNotes");
    for(const friendId in selectedFriends){
        const sharedNotePackage:sharedNotePackage={
            senderId:senderId,
            receiverId:selectedFriends[friendId],
            sharedAt:Date.now(),
            sharedNote:noteData
        }
        const res=await sharedNotes.insertOne(sharedNotePackage);
    }

}
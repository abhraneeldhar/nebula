"use server"
import { Note } from "../fileFormat";
import { mongoClientCS } from "../mongoConnector"
import { v4 as uuidv4 } from "uuid";
interface sharedNotePackage{
    id:string,
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
            id:uuidv4(),
            senderId:senderId,
            receiverId:selectedFriends[friendId],
            sharedAt:Date.now(),
            sharedNote:noteData
        }
        const res=await sharedNotes.insertOne(sharedNotePackage);
    }

}
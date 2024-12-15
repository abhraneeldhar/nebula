"use server"
import { mongoClientCS } from "../mongoConnector"
export async function getIncomingNotes(userId: string) {
    await mongoClientCS.connect();
    const db = mongoClientCS.db("notesApp");
    const sharedNotes = db.collection("sharedNotes");
    const incomingNotes = await sharedNotes.find({
        receiverId: userId
    }).toArray();


    const serializedNotes= incomingNotes.map(sharedNote => ({
        ...sharedNote,
        _id: sharedNote._id.toString(), // Convert ObjectId to a string
    }));
    return (serializedNotes)
}
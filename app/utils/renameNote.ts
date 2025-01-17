"use server"
import { mongoClientCS } from "./mongoConnector";

export async function renameNote(noteId: string, newName: string) {
    await mongoClientCS.connect();
    const db = mongoClientCS.db("notesApp");
    const notesCollection = db.collection("notes");
    const upRes = await notesCollection.updateOne({ id: noteId }, { $set: { title: newName } });
    return (upRes)
}

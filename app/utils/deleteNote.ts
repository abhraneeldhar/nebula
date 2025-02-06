"use server"
import { mongoClientCS } from "./mongoConnector";

export async function deleteNote(noteId: string) {
    await mongoClientCS.connect();
    const db = mongoClientCS.db("notesApp");
    const notesColelction = db.collection("notes");
    const res = await notesColelction.deleteOne({ id: noteId });
    console.log(res);
    return ({ message: `deleted ${noteId}`, res })
}
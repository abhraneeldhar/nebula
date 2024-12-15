"use server"

import { Note } from "../fileFormat";
import { mongoClientCS } from "../mongoConnector";

export async function deleteSharedNote(noteId:string){
    await mongoClientCS.connect();
    const db=mongoClientCS.db("notesApp");
    const sharedNotes=db.collection("sharedNotes");
    const res=sharedNotes.deleteOne({id:noteId});
}
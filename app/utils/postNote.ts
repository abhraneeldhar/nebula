"use server"
import { Note } from "./fileFormat";
import { mongoClientCS } from "./mongoConnector";
export async function postNote(newNote: string){
        const noteData = JSON.parse(newNote);
        // console.log("notedata>>>>>",noteDataString);
        await mongoClientCS.connect();
        const db=mongoClientCS.db("notesApp");
        const notesCollection=db.collection("notes");

        const res= await notesCollection.updateOne(
            { id:noteData.id },
            { $set: noteData},
            { upsert: true }
        );
}

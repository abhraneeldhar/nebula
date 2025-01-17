"use server"
import { mongoClientCS } from "./mongoConnector";

export async function getDisplayNotes(userId: string){
    await mongoClientCS.connect();
        const db=mongoClientCS.db("notesApp");
        const notesCollection=db.collection("notes");
        const displayNotes= await notesCollection.find({ owner: userId },{projection:{content:0}}).toArray();
        // console.log(displayNotes)
        return (displayNotes)
}

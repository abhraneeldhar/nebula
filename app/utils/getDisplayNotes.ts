"use server"
import { getOneNote } from "./getOneNote";
import { mongoClientCS } from "./mongoConnector";

export async function getDisplayNotes(userId: string) {
    await mongoClientCS.connect();
    const db = mongoClientCS.db("notesApp");
    const notesCollection = db.collection("notes");
    const displayNotes = await notesCollection.find({ owner: userId }, { projection: { content: 0 } }).toArray();
    // console.log("display notes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",displayNotes)
    displayNotes.forEach((note)=>{
        const getCatches=async()=>{
            const immaCatche= await getOneNote(userId,note.id as string);
        }
        getCatches()
    })
    return (JSON.parse(JSON.stringify(displayNotes)))
}

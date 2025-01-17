"use server"
import { Delta } from "quill/core";
import { mongoClientCS } from "./mongoConnector";
import { Note } from "./fileFormat";

export async function getOneNote(userId: string, noteId: string) {
    await mongoClientCS.connect();
        const db=mongoClientCS.db("notesApp");
        const notesCollection=db.collection("notes");
        const noteData=await notesCollection.findOne({id:noteId},{ projection: { id:1,owner:1} });
        if(!noteData){
            const newNote:Note={
                owner:userId as string,
                id:noteId as string,
                createdAt: Number(new Date()),
                lastModifiedAt:Number(new Date()),
                content:{} as Delta,
                parent:{
                    folderId:null,
                    folderName:"root"
                },
                type:"Note",
                snippet:"",
                title:"Untitled"
            }
            return (newNote)
        }
        else{
            if(noteData.owner!=userId){
                return null;
            }
            else if(noteData.owner==userId){
                const noteData=await notesCollection.findOne({id:noteId, owner:userId});
                return (JSON.parse(JSON.stringify(noteData)))
            }
        }
}
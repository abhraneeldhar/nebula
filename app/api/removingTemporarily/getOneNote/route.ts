import { Note } from "@/app/utils/fileFormat";
import { mongoClientCS } from "@/app/utils/mongoConnector";
import { Delta } from "quill/core";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const noteId= searchParams.get("noteId");
    const userId=searchParams.get("userId");
    try{
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
            return Response.json(newNote)
        }
        else{
            if(noteData.owner!=userId){
                return Response.json({"message":"access denied","status":403})
            }
            else if(noteData.owner==userId){
                const noteData=await notesCollection.findOne({id:noteId, owner:userId});
                return Response.json(noteData)
            }
        }
    }
    catch(Error){
        console.log(Error)
        return Response.json({Error})
    }
   
  }

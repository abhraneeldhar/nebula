import { mongoClientCS } from "@/app/utils/mongoConnector";

export async function PATCH(req:Request){
    const {searchParams}=new URL(req.url);
    const noteId=searchParams.get("noteId");
    const newName=searchParams.get("newName");
    try{
        await mongoClientCS.connect();
        const db=mongoClientCS.db("notesApp");
        const notesCollection=db.collection("notes");
        const upRes= await notesCollection.updateOne({id:noteId},{$set:{title:newName}});
        console.log(upRes);
        return Response.json({message:`changed ${noteId} to ${newName}`})
    }
    catch(error){
        console.log(error)
        return Response.json({error});
    }
}
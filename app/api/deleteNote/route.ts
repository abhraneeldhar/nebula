import { mongoClientCS } from "@/app/utils/mongoConnector";

export async function DELETE(req:Request){
    const {searchParams}=new URL(req.url);
    const noteId=searchParams.get("noteId");
    try{
        await mongoClientCS.connect();
        const db=mongoClientCS.db("notesApp");
        const notesColelction=db.collection("notes");
        const res=await notesColelction.deleteOne({id:noteId});
        console.log(res);
        return Response.json({message: `deleted ${noteId}`,res})


    }
    catch(error){
        console.log(error);
        return Response.json({error})
    }
}
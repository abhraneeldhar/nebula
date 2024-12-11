import { mongoClientCS } from "@/app/utils/mongoConnector";

export async function POST(req: Request, res: Response){
    
    try{
        const noteDataString=await req.text();
        const noteData = JSON.parse(noteDataString);
        console.log("notedata>>>>>",noteDataString);
        await mongoClientCS.connect();
        const db=mongoClientCS.db("notesApp");
        const notesCollection=db.collection("notes");

        await notesCollection.updateOne(
            { id:noteData.id },
            { $set: noteData},
            { upsert: true }
        );

        return Response.json({message: "Uploaded Note"})
    }
    catch(error) {
        console.log(error);
        return Response.json({ error })
    }
}
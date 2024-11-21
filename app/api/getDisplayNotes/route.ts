import { mongoClientCS } from "@/app/utils/mongoConnector";
export async function GET(req: Request){
    const {searchParams}=new URL(req.url);
    const userId=searchParams.get("userid");
    try{
        await mongoClientCS.connect();
        const db=mongoClientCS.db("notesApp");
        const notesCollection=db.collection("notes");
        const displayNotes= await notesCollection.find({ owner: userId },{projection:{content:0}}).toArray();
        // console.log(displayNotes)
        return Response.json(displayNotes)
    }
    catch(error){
        console.log(error);
        return Response.json(error);
    }
}
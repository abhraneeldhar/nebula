import { mongoClientCS } from "@/app/utils/mongoConnector";

export async function GET(request: Request){
    const {searchParams}= new URL(request.url);
    const userId=searchParams.get("id");
    try{

        await mongoClientCS.connect();
        const db=mongoClientCS.db("notesApp");
        const usersCollection=db.collection("users");
        const userDetailsJson = await usersCollection.findOne({userId:userId});
        console.log(userDetailsJson);
        return Response.json(userDetailsJson);
    }
    catch(error){
        return Response.json(error);
    }
}
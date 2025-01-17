import { mongoClientCS } from "@/app/utils/mongoConnector";

export async function GET(request: Request){
    const {searchParams}= new URL(request.url);
    const userEmail=searchParams.get("email");
    try{
        await mongoClientCS.connect();
        const db=mongoClientCS.db("notesApp");
        const usersCollection=db.collection("users");
        const user = await usersCollection.findOne({email: userEmail});
        console.log("userid>>>>>>>> ",user?.userId.toString());
        return Response.json(user?.userId.toString());
    }
    catch(error){
        return Response.json(error);
    }
}
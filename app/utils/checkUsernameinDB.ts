"use server"
import { mongoClientCS } from "./mongoConnector";
export async function checkUsernameinDB(usernameState:string){
    await mongoClientCS.connect();
    const db=mongoClientCS.db("notesApp");
    const users=db.collection("users");
    const prevUserCount=await users.countDocuments({"userName":usernameState});
    if(prevUserCount>0){
        return(true);
    }
    else{
        return(false);
    }

}
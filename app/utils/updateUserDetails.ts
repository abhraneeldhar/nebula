"use server"
import { userDetailsType } from "../setupAccount/page"
import { mongoClientCS } from "./mongoConnector"

export async function updateUserDetails(userId:string ,nameState: string, usernameState : string, imgUrl : string){
    await mongoClientCS.connect();
    const db=mongoClientCS.db("notesApp");
    const users=db.collection("users");
    const res =await users.updateOne({userId:userId},[{$set:{name:nameState,userName:usernameState,imageUrl:imgUrl}}]);
    return(res)
}